import { Skeleton, Tabs } from 'antd';
import { bxCopy, bxLinkExternal } from 'boxicons-quasar';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { SCANNERS } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import WalletPositions from 'modules/autoTrader/Positions/WalletPositions';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaWalletPricedAssets';
import WalletSwaps from 'modules/autoTrader/WalletSwaps';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { useEffect, useState } from 'react';
import { useHasFlag, useTraderAssetQuery } from 'services/rest';
import {
  useUpdateWalletMutation,
  useWalletQuery,
  useWalletsQuery,
  type Wallet,
} from 'services/rest/wallets';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import EditableText from 'shared/v1-components/EditableText';
import { useSessionStorage } from 'usehooks-ts';
import { shortenAddress } from 'utils/address';
import { roundSensible } from 'utils/numbers';
import WalletStatus from './WalletStatus';

export default function WalletDetail() {
  const [slug, setSlug] = useSessionStorage('walletSlug', '');
  const { data: wallet } = useWalletQuery(slug);
  const [copy, notif] = useShare('copy');
  const { openScan } = useWalletActionHandler();
  const { balance, isPending } = useSolanaWalletBalanceInUSD(wallet?.address);
  const [resolution, setResolution] = useState<number>();
  const hasFlag = useHasFlag();
  const { data, isLoading } = useTraderAssetQuery({
    walletAddress: wallet?.address!,
    fromTime: resolution
      ? dayjs().subtract(resolution, 'day').startOf('day').toISOString()
      : undefined,
  });

  const { data: wallets } = useWalletsQuery();
  useEffect(() => {
    if (wallets && !slug) {
      const walletKey = wallets?.results[0].key;
      setSlug(walletKey);
    }
  }, [wallets, setSlug, slug]);

  return wallet ? (
    <div>
      <div className="flex items-center gap-1">
        <WalletName wallet={wallet} />
        <HoverTooltip className="inline" title="Copy Wallet Address">
          <Button
            className="mt-1 text-v1-content-primary/70"
            fab
            onClick={() => copy(wallet.address)}
            size="3xs"
            surface={0}
            variant="ghost"
          >
            <Icon className="[&>svg]:size-4" name={bxCopy} />
          </Button>
        </HoverTooltip>
        <HoverTooltip
          className="inline"
          title={`View on ${SCANNERS[wallet.network_slug].name}`}
        >
          <Button
            className="mt-1 text-v1-content-primary/70"
            fab
            onClick={() => openScan(wallet)}
            size="3xs"
            surface={0}
            variant="ghost"
          >
            <Icon className="[&>svg]:size-4" name={bxLinkExternal} size={14} />
          </Button>
        </HoverTooltip>
      </div>
      <p className="text-v1-content-secondary text-xs">
        {shortenAddress(wallet.address)}
      </p>
      <div className="my-4 grid grid-cols-5 gap-3">
        <div
          className={clsx(
            hasFlag('/wallet/status') ? 'col-span-3' : 'col-span-5',
            'mobile:col-span-5 flex h-40 flex-col justify-between rounded-xl bg-v1-surface-l1 p-4',
          )}
        >
          <p className="text-v1-content-secondary text-xs">Current Balance</p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-2xl">
              {isPending ? 'Loading...' : `$${roundSensible(balance)}`}
            </p>
            <WalletActions wallet={wallet} />
          </div>
        </div>
        {hasFlag('/wallet/status') && (
          <div className="col-span-2 mobile:col-span-5 flex flex-col justify-between rounded-xl bg-v1-surface-l1 p-4 pt-3">
            <div className="mb-7 flex items-center justify-between text-v1-content-secondary text-xs">
              Details
              <ButtonSelect
                buttonClassName="w-12"
                onChange={newValue => setResolution(newValue)}
                options={
                  [
                    { value: 1, label: '1D' },
                    { value: 7, label: '7D' },
                    { value: 30, label: '30D' },
                    { value: undefined, label: 'ALL' },
                  ] as const
                }
                size="xs"
                surface={2}
                value={resolution}
                variant="white"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="grow text-xxs">
                <p className="pb-3 text-v1-content-secondary">Realized PnL</p>
                {isLoading ? (
                  <Skeleton.Input size="small" />
                ) : (
                  <span className="text-base text-v1-content-secondary">
                    <DirectionalNumber
                      label="$"
                      showIcon={false}
                      showSign={true}
                      value={+(data?.realized_pnl_usd ?? '0')}
                    />{' '}
                    (
                    <DirectionalNumber
                      format={{
                        decimalLength: 1,
                      }}
                      showIcon={false}
                      showSign={true}
                      suffix="%"
                      value={+(data?.realized_pnl_percent ?? '0')}
                    />
                    )
                  </span>
                )}
              </div>
              <div className="h-10 border-v1-inverse-overlay-10 border-r" />
              <div className="grow text-xxs">
                <p className="pb-3 text-v1-content-secondary">Win Rate</p>
                {isLoading ? (
                  <Skeleton.Input size="small" />
                ) : (
                  <ReadableNumber
                    className="text-base"
                    format={{ decimalLength: 1 }}
                    label="%"
                    value={+(data?.win_percent ?? '0')}
                  />
                )}
              </div>
              <div className="h-10 border-v1-inverse-overlay-10 border-r" />
              <div className="grow text-xxs">
                <p className="pb-3 text-v1-content-secondary">TXs</p>
                {isLoading ? (
                  <Skeleton.Input size="small" />
                ) : (
                  <p className="text-base text-v1-content-secondary">
                    <DirectionalNumber
                      direction="up"
                      showIcon={false}
                      showSign={false}
                      value={+(data?.buy_count ?? '0')}
                    />
                    /
                    <DirectionalNumber
                      direction="down"
                      showIcon={false}
                      showSign={false}
                      value={+(data?.sell_count ?? '0')}
                    />
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Buys/Sells',
            children: <WalletSwaps wallet={wallet} />,
          },
          {
            key: '2',
            label: 'Positions',
            children: <WalletPositions wallet={wallet} />,
          },
          {
            key: '3',
            label: 'Account PnL',
            children: <WalletStatus wallet={wallet} />,
          },
        ]}
      />
      {notif}
    </div>
  ) : null;
}

function WalletName({ wallet }: { wallet: Wallet }) {
  const { mutate } = useUpdateWalletMutation(wallet?.key);

  const updateName = (newName: string) => {
    mutate({ name: newName });
  };

  return (
    <EditableText
      className="text-lg"
      onChange={updateName}
      resetOnBlank
      surface={0}
      value={wallet.name}
    />
  );
}

function WalletActions({ wallet }: { wallet: Wallet }) {
  const { withdrawDepositModal, deposit, withdraw, transfer } =
    useWalletActionHandler();

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => deposit(wallet.address)} size="md">
        Deposit
      </Button>
      <Button
        className="!bg-transparent"
        onClick={() => withdraw(wallet.address)}
        size="md"
        variant="outline"
      >
        Withdraw
      </Button>
      <Button
        className="!bg-transparent"
        onClick={() => transfer(wallet.address)}
        size="md"
        variant="outline"
      >
        Transfer
      </Button>
      {withdrawDepositModal}
    </div>
  );
}
