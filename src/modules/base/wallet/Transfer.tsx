import { notification } from 'antd';
import { useNativeTokenBalance } from 'api/chains';
import { tokenAddressToSlug, useTokensInfo } from 'api/token-info';
import {
  useWalletsQuery,
  useWalletWithdrawMutation,
  type Wallet,
} from 'api/wallets';
import { useSolanaWalletPricedAssets } from 'modules/autoTrader/UserAssets/useSolanaWalletPricedAssets';
import SensibleSteps from 'modules/base/wallet/SensibleSteps';
import { useEffect, useState } from 'react';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';
import { Select } from 'shared/v1-components/Select';
import { Token } from 'shared/v1-components/Token';
import { shortenAddress } from 'utils/address';

export default function Transfer({
  wallet,
  mode,
  onClose,
}: {
  wallet: Wallet;
  mode: 'internal_transfer' | 'external_transfer';
  onClose: () => void;
}) {
  const [fromWallet, setFromWallet] = useState<Wallet>();
  const [toWallet, setToWallet] = useState('');
  const [internalToWallet, setInternalToWallet] = useState<Wallet>();
  const [selectedAsset, setSelectedAsset] =
    useState<
      NonNullable<
        ReturnType<typeof useSolanaWalletPricedAssets>['data']
      >[number]
    >();
  const [amount, setAmount] = useState<string>();
  const { data: walletAssets } = useSolanaWalletPricedAssets(
    fromWallet?.address,
  );

  console.log(walletAssets);
  const { data: wallets } = useWalletsQuery();
  const { mutateAsync, isPending } = useWalletWithdrawMutation(fromWallet?.key);
  const { data: symbols } = useTokensInfo({
    tokenAddresses: walletAssets?.map(asset => asset.address),
  });
  const { data: nativeBalance } = useNativeTokenBalance(fromWallet?.address);
  console.log(symbols);
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
        symbol_slug: tokenAddressToSlug(selectedAsset.address),
        amount: isMax ? 'ALL' : amount,
        receiver_address: (toWallet || internalToWallet?.address) ?? '',
      }).then(() => {
        notification.success({ message: 'Asset successfully transferred' });
        onClose();
      });
  };

  useEffect(() => {
    setFromWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    if (walletAssets?.length === 0) setSelectedAsset(undefined);
  }, [walletAssets]);

  const assetToSymbol = (address: string) => {
    return symbols?.find(s => s?.contract_address === address);
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
                    {assetToSymbol(asset.address)?.name}
                  </span>
                  <div className="flex items-center gap-2 text-v1-content-secondary text-xs">
                    <Token address={asset.address} autoFill icon size="xs" />
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
              selectedAsset && assetToSymbol(selectedAsset?.address)?.symbol
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
