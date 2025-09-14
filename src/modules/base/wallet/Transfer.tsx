import { notification } from 'antd';
import { useAccountNativeBalance } from 'api/chains';
import { useSymbolsInfo } from 'api/symbol';
import {
  useWalletsQuery,
  useWalletWithdrawMutation,
  type Wallet,
} from 'api/wallets';
import { useSolanaUserAssets } from 'modules/autoTrader/UserAssets/useSolanaUserAssets';
import SensibleSteps from 'modules/base/wallet/SensibleSteps';
import { useEffect, useState } from 'react';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';
import { Select } from 'shared/v1-components/Select';
import { shortenAddress } from 'utils/shortenAddress';

export default function Transfer({
  wallet,
  mode,
}: {
  wallet: Wallet;
  mode: 'internal_transfer' | 'external_transfer';
}) {
  const [fromWallet, setFromWallet] = useState<Wallet>();
  const [toWallet, setToWallet] = useState('');
  const [internalToWallet, setInternalToWallet] = useState<Wallet>();
  const [selectedAsset, setSelectedAsset] =
    useState<
      NonNullable<ReturnType<typeof useSolanaUserAssets>['data']>[number]
    >();
  const [amount, setAmount] = useState<string>();
  const { data: walletAssets } = useSolanaUserAssets(fromWallet?.address);
  const { data: wallets } = useWalletsQuery();
  const { mutateAsync, isPending } = useWalletWithdrawMutation(fromWallet?.key);
  const { data: symbols } = useSymbolsInfo(
    walletAssets?.map(asset => asset.slug),
  );
  const { data: nativeBalance } = useAccountNativeBalance(fromWallet?.address);

  const sameAddress =
    (toWallet || internalToWallet?.address) === fromWallet?.address;
  const isValid =
    selectedAsset &&
    amount &&
    (toWallet || internalToWallet?.address) &&
    !sameAddress;

  const withdraw = () => {
    const isMax = Number(amount) === selectedAsset?.amount;

    if (!nativeBalance) {
      notification.error({
        message: 'Not enough SOL balance to cover gas fee',
      });
      return;
    }

    if (isValid)
      void mutateAsync({
        symbol_slug: selectedAsset?.slug,
        amount: isMax ? 'ALL' : amount,
        receiver_address: (toWallet || internalToWallet?.address) ?? '',
      }).then(() =>
        notification.success({ message: 'Asset successfully transferred' }),
      );
  };

  useEffect(() => {
    setFromWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    if (walletAssets?.length === 0) setSelectedAsset(undefined);
  }, [walletAssets]);

  const assetToSymbol = (slug: string) => {
    return symbols?.find(s => s?.slug === slug);
  };

  return (
    <div className="text-xs">
      {mode === 'external_transfer' && (
        <p className="mt-3 text-v1-content-secondary">
          To ensure the security of your assets, please verify the recipient
          wallet address again before transferring to prevent asset loss.
        </p>
      )}

      <p className="my-4">From</p>
      <Select
        className="!h-16 w-full"
        dialogClassName="w-80"
        onChange={newWallet => setFromWallet(newWallet)}
        options={wallets?.results}
        render={wallet => (
          <div>
            <p className="text-sm">{wallet?.name}</p>
            <p className="text-v1-content-secondary text-xs">
              {shortenAddress(wallet?.address)}
            </p>
          </div>
        )}
        surface={2}
        value={fromWallet}
      />

      {walletAssets?.length ? (
        <>
          <Select
            className="mt-5 w-full"
            dialogClassName="w-80"
            onChange={newAsset => setSelectedAsset(newAsset)}
            options={walletAssets}
            placeholder="Select Asset"
            render={asset =>
              asset && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {assetToSymbol(asset.slug)?.name}
                  </span>
                  <div className="flex items-center gap-2 text-v1-content-secondary text-xs">
                    <img
                      alt=""
                      className="size-4"
                      src={assetToSymbol(asset.slug)?.logo_url ?? ''}
                    />
                    {asset?.amount}
                  </div>
                </div>
              )
            }
            surface={2}
            value={selectedAsset}
          />

          <Input
            className="mt-3 w-full"
            onChange={newAmount => setAmount(String(newAmount))}
            placeholder="Enter Withdrawal Amount"
            suffixIcon={
              selectedAsset && assetToSymbol(selectedAsset?.slug)?.abbreviation
            }
            surface={2}
            value={amount}
          />

          <SensibleSteps
            balance={selectedAsset?.amount ?? 0}
            className="my-2"
            onChange={newAmount => setAmount(newAmount)}
            surface={2}
          />
        </>
      ) : (
        <p className="mt-5">There is no asset in this wallet</p>
      )}

      <hr className="my-5 border-v1-inverse-overlay-10" />

      {mode === 'internal_transfer' ? (
        <>
          <p className="mb-4">To</p>
          <Select
            className="!h-16 w-full"
            dialogClassName="w-80"
            onChange={newWallet => setInternalToWallet(newWallet)}
            options={wallets?.results}
            placeholder="Select Your Destination Wallet"
            render={wallet => (
              <div>
                <p className="text-sm">{wallet?.name}</p>
                <p className="text-v1-content-secondary text-xs">
                  {shortenAddress(wallet?.address)}
                </p>
              </div>
            )}
            surface={2}
            value={internalToWallet}
          />
          {internalToWallet?.address === fromWallet?.address && (
            <p className="mt-3 text-v1-content-negative">
              Wallets cant be the same
            </p>
          )}
        </>
      ) : (
        <Input
          className="w-full"
          onChange={value => setToWallet(value)}
          pattern="^[1-9A-HJ-NP-Za-km-z]{32,44}$"
          placeholder="Type Your Wallet Address"
          surface={2}
          type="string"
          value={toWallet}
        />
      )}

      <Button
        className="mt-7 w-full"
        disabled={!isValid}
        loading={isPending}
        onClick={withdraw}
      >
        {mode === 'internal_transfer' ? 'Transfer' : 'Withdraw'}
      </Button>
    </div>
  );
}
