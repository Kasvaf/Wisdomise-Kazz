import { useEffect, useState } from 'react';
import { notification, Slider } from 'antd';
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
  const [amount, setAmount] = useState<number>();
  const { data: walletAssets } = useSolanaUserAssets(wallet.address);
  const { data: wallets } = useWalletsQuery();
  const { mutateAsync, isPending } = useWalletWithdrawMutation(
    fromWallet?.address,
  );

  const isValid =
    selectedAsset && amount && (toWallet || internalToWallet?.address);

  const withdraw = () => {
    if (isValid)
      void mutateAsync({
        symbol_slug: selectedAsset?.slug,
        amount: String(amount),
        receiver_address: (toWallet || internalToWallet?.address) ?? '',
      }).then(() =>
        notification.success({ message: 'Asset successfully transferred' }),
      );
  };

  const marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  };

  useEffect(() => {
    setFromWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    if (!walletAssets) return;
    if (
      !selectedAsset ||
      walletAssets.map(a => a.slug)?.includes(selectedAsset.slug)
    ) {
      setSelectedAsset(walletAssets[0]);
    }
  }, [selectedAsset, walletAssets]);

  return (
    <div className="text-xs">
      {mode === 'external_transfer' && (
        <p className="my-3">
          To ensure the security of your assets, please verify the recipient
          wallet address again before transferring to prevent asset loss.
        </p>
      )}

      <p className="mb-4">From</p>
      <Select
        surface={4}
        className="w-full"
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
            className="mt-5 w-full"
            value={selectedAsset}
            onChange={newAsset => setSelectedAsset(newAsset)}
            options={walletAssets}
            render={asset => (
              <div className="flex items-center justify-between">
                <span className="text-sm">{asset?.slug}</span>
                <span className="text-xs text-v1-content-secondary">
                  {asset?.amount}
                </span>
              </div>
            )}
          />

          <Input
            type="number"
            value={amount}
            onChange={newAmount => setAmount(newAmount)}
            placeholder="Enter Withdrawal Amount"
            className="mt-3 w-full"
            surface={4}
            suffixIcon={selectedAsset?.slug}
          />

          <Slider
            defaultValue={0}
            onChange={percentage =>
              setAmount(((selectedAsset?.amount ?? 0) * percentage) / 100)
            }
            min={0}
            max={100}
            marks={marks}
            step={null}
            tooltip={{ open: false }}
            trackStyle={{ backgroundColor: '#1890ff', height: 4 }}
            handleStyle={{
              borderColor: '#1890ff',
              backgroundColor: '#1890ff',
            }}
            railStyle={{ backgroundColor: '#2c2f36', height: 4 }}
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
            className="w-full"
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
