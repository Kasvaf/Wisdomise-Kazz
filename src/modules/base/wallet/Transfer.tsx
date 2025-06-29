import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { Select } from 'shared/v1-components/Select';
import { shortenAddress } from 'utils/shortenAddress';
import { useSolanaUserAssets } from 'api/chains/solana';
import { Input } from 'shared/v1-components/Input';
import { Button } from 'shared/v1-components/Button';
import {
  useWalletsQuery,
  useWalletWithdrawMutation,
  type Wallet,
} from 'api/wallets';
import { useSymbolsInfo } from 'api/symbol';
import SensibleSteps from 'modules/autoTrader/BuySellTrader/SensibleSteps';

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

  const sameAddress =
    (toWallet || internalToWallet?.address) === fromWallet?.address;
  const isValid =
    selectedAsset &&
    amount &&
    (toWallet || internalToWallet?.address) &&
    !sameAddress;

  const withdraw = () => {
    const isMax = Number(amount) === selectedAsset?.amount;
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
    return symbols?.find(s => s.slug === slug);
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
        surface={4}
        className="!h-16 w-full"
        dialogClassName="w-80"
        value={fromWallet}
        onChange={newWallet => setFromWallet(newWallet)}
        options={wallets?.results}
        render={wallet => (
          <div>
            <p className="text-sm">{wallet?.name}</p>
            <p className="text-xs text-v1-content-secondary">
              {shortenAddress(wallet?.address)}
            </p>
          </div>
        )}
      />

      {walletAssets?.length ? (
        <>
          <Select
            surface={4}
            placeholder="Select Asset"
            className="mt-5 w-full"
            dialogClassName="w-80"
            value={selectedAsset}
            onChange={newAsset => setSelectedAsset(newAsset)}
            options={walletAssets}
            render={asset =>
              asset && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {assetToSymbol(asset.slug)?.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-v1-content-secondary">
                    <img
                      className="size-4"
                      src={assetToSymbol(asset.slug)?.logo_url ?? ''}
                      alt=""
                    />
                    {asset?.amount}
                  </div>
                </div>
              )
            }
          />

          <Input
            value={amount}
            onChange={newAmount => setAmount(String(newAmount))}
            placeholder="Enter Withdrawal Amount"
            className="mt-3 w-full"
            surface={4}
            suffixIcon={
              selectedAsset && assetToSymbol(selectedAsset?.slug)?.abbreviation
            }
          />

          <SensibleSteps
            className="my-2"
            balance={selectedAsset?.amount ?? 0}
            value={amount}
            onClick={newAmount => setAmount(newAmount)}
            surface={4}
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
            placeholder="Select Your Destination Wallet"
            surface={4}
            className="!h-16 w-full"
            dialogClassName="w-80"
            value={internalToWallet}
            onChange={newWallet => setInternalToWallet(newWallet)}
            options={wallets?.results}
            render={wallet => (
              <div>
                <p className="text-sm">{wallet?.name}</p>
                <p className="text-xs text-v1-content-secondary">
                  {shortenAddress(wallet?.address)}
                </p>
              </div>
            )}
          />
          {internalToWallet?.address === fromWallet?.address && (
            <p className="mt-3 text-v1-content-negative">
              Wallets cant be the same
            </p>
          )}
        </>
      ) : (
        <Input
          type="string"
          pattern="^[1-9A-HJ-NP-Za-km-z]{32,44}$"
          value={toWallet}
          onChange={value => setToWallet(value)}
          placeholder="Type Your Wallet Address"
          className="w-full"
          surface={4}
        />
      )}

      <Button
        disabled={!isValid}
        onClick={withdraw}
        loading={isPending}
        className="mt-7 w-full"
      >
        {mode === 'internal_transfer' ? 'Transfer' : 'Withdraw'}
      </Button>
    </div>
  );
}
