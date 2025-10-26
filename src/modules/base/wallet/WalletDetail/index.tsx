import { Tabs } from 'antd';
import { useHasFlag } from 'api';
import {
  useUpdateWalletMutation,
  useWalletQuery,
  type Wallet,
} from 'api/wallets';
import { bxCopy, bxEdit, bxLinkExternal } from 'boxicons-quasar';
import clsx from 'clsx';
import { SCANNERS } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import WalletPositions from 'modules/autoTrader/Positions/WalletPositions';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaWalletPricedAssets';
import WalletSwaps from 'modules/autoTrader/WalletSwaps';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { useWalletStatus } from 'modules/base/wallet/WalletDetail/useWalletStatus';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { useRef, useState } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { shortenAddress } from 'utils/address';
import { roundSensible } from 'utils/numbers';
import WalletStatus from './WalletStatus';

export default function WalletDetail(_: {
  expanded?: boolean;
  focus?: boolean;
}) {
  const params = useDiscoveryParams();
  const slug = params.slugs?.[0];
  if (!slug) throw new Error('unexpected');
  const { data: wallet } = useWalletQuery(slug);
  const [copy, notif] = useShare('copy');
  const { openScan } = useWalletActionHandler();
  const { balance, isPending } = useSolanaWalletBalanceInUSD(wallet?.address);
  const [resolution, setResolution] = useState<'1d' | '7d' | '30d'>('1d');
  const { realizedPnl, realizedPnlPercentage, numBuys, numSells, winRate } =
    useWalletStatus({ resolution, address: wallet?.address });
  const hasFlag = useHasFlag();

  return wallet ? (
    <div className="p-3">
      <div className="flex items-center gap-2">
        <WalletName wallet={wallet} />
        <HoverTooltip className="inline" title="Copy Wallet Address">
          <button
            className="mt-1 text-v1-content-secondary"
            onClick={() => copy(wallet.address)}
          >
            <Icon name={bxCopy} size={16} />
          </button>
        </HoverTooltip>
        <HoverTooltip
          className="inline"
          title={`View on ${SCANNERS[wallet.network_slug].name}`}
        >
          <button
            className="mt-1 text-v1-content-secondary"
            onClick={() => openScan(wallet)}
          >
            <Icon name={bxLinkExternal} size={16} />
          </button>
        </HoverTooltip>
      </div>
      <p className="text-v1-content-secondary text-xs">
        {shortenAddress(wallet.address)}
      </p>
      <div className="my-4 grid grid-cols-5 gap-3">
        <div
          className={clsx(
            hasFlag('/wallet/status') ? 'col-span-3' : 'col-span-5',
            'flex h-40 flex-col justify-between rounded-xl bg-v1-surface-l1 p-4',
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
          <div className="col-span-2 flex flex-col justify-between rounded-xl bg-v1-surface-l1 p-4 pt-3">
            <div className="mb-7 flex items-center justify-between text-v1-content-secondary text-xs">
              Details
              <ButtonSelect
                buttonClassName="w-12"
                onChange={newValue => setResolution(newValue)}
                options={
                  [
                    { value: '1d', label: '1D' },
                    { value: '7d', label: '7D' },
                    { value: '30d', label: '30D' },
                  ] as const
                }
                size="xs"
                surface={2}
                value={resolution}
                variant="white"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xxs">
                <p className="pb-3 text-v1-content-secondary">Realized PnL</p>
                <span className="text-base text-v1-content-secondary">
                  <DirectionalNumber
                    label="$"
                    showIcon={false}
                    showSign={true}
                    value={realizedPnl}
                  />{' '}
                  (
                  <DirectionalNumber
                    format={{
                      decimalLength: 1,
                    }}
                    showIcon={false}
                    showSign={true}
                    suffix="%"
                    value={realizedPnlPercentage}
                  />
                  )
                </span>
              </div>
              <div className="h-10 border-v1-inverse-overlay-10 border-r" />
              <div className="text-xxs">
                <p className="pb-3 text-v1-content-secondary">Win Rate</p>
                <ReadableNumber
                  className="text-base"
                  format={{ decimalLength: 1 }}
                  label="%"
                  value={winRate}
                />
              </div>
              <div className="h-10 border-v1-inverse-overlay-10 border-r" />
              <div className="text-xxs">
                <p className="pb-3 text-v1-content-secondary">TXs</p>
                <p className="text-base text-v1-content-secondary">
                  <DirectionalNumber
                    direction="up"
                    showIcon={false}
                    showSign={false}
                    value={numBuys}
                  />
                  /
                  <DirectionalNumber
                    direction="down"
                    showIcon={false}
                    showSign={false}
                    value={numSells}
                  />
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Tabs
        defaultActiveKey={hasFlag('/wallet/status') ? '1' : '2'}
        items={[
          ...(hasFlag('/wallet/status')
            ? [
                {
                  key: '1',
                  label: 'Account PnL',
                  children: <WalletStatus wallet={wallet} />,
                },
              ]
            : []),
          {
            key: '2',
            label: 'Buys/Sells',
            children: <WalletSwaps wallet={wallet} />,
          },
          {
            key: '3',
            label: 'Positions',
            children: <WalletPositions wallet={wallet} />,
          },
        ]}
      />
      {notif}
    </div>
  ) : null;
}

function WalletName({ wallet }: { wallet: Wallet }) {
  const [newName, setNewName] = useState(wallet?.name ?? '');
  const [editMode, setEditMode] = useState(false);
  const { mutate } = useUpdateWalletMutation(wallet?.key);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateName = () => {
    if (newName && wallet) {
      mutate({ name: newName });
      wallet.name = newName;
    } else {
      setNewName(wallet?.name ?? '');
    }
    setEditMode(false);
  };

  return editMode ? (
    <input
      className="bg-transparent"
      defaultValue={newName}
      onBlur={updateName}
      onChange={e => setNewName(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          updateName();
        }
      }}
      ref={inputRef}
    />
  ) : (
    <div className="flex items-center gap-2">
      <span>{wallet.name}</span>
      <HoverTooltip className="inline" ignoreFocus title="Rename">
        <button
          className="text-v1-content-secondary"
          onClick={() => {
            setEditMode(prev => !prev);
            setTimeout(() => inputRef.current?.select(), 0);
          }}
        >
          <Icon name={bxEdit} size={16} />
        </button>
      </HoverTooltip>
    </div>
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
