/* eslint-disable import/max-dependencies */
import { useRef, useState } from 'react';
import { bxCopy, bxEdit, bxLinkExternal } from 'boxicons-quasar';
import { Tabs, type TabsProps } from 'antd';
import {
  useUpdateWalletMutation,
  useWalletQuery,
  type Wallet,
} from 'api/wallets';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { Button } from 'shared/v1-components/Button';
import { SCANNERS } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import WalletPositions from 'modules/base/wallet/WalletDetail/WalletPositions';
import AccountPnL from 'modules/base/wallet/WalletDetail/AccountPnL';
import BuySellList from 'modules/base/wallet/WalletDetail/BuySellList';
import { roundSensible } from 'utils/numbers';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaUserAssets';

export default function WalletDetail(_: {
  expanded?: boolean;
  focus?: boolean;
}) {
  const {
    params: { slug },
  } = useDiscoveryRouteMeta();
  if (!slug) throw new Error('unexpected');
  const { data: wallet } = useWalletQuery(slug);
  const [copy, notif] = useShare('copy');
  const { openScan } = useWalletActionHandler();
  const [period, setPeriod] = useState<number | null>(null);
  const { balance, isPending } = useSolanaWalletBalanceInUSD(wallet?.address);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Account PnL',
      children: <AccountPnL />,
    },
    {
      key: '2',
      label: 'Buys/Sells',
      children: <BuySellList />,
    },
    {
      key: '3',
      label: 'Positions',
      children: <WalletPositions />,
    },
  ];

  return wallet ? (
    <div>
      <div className="flex items-center gap-2">
        <WalletName wallet={wallet} />
        <HoverTooltip className="inline" title="Copy Wallet Address">
          <button
            onClick={() => copy(wallet.address)}
            className="mt-1 text-v1-content-secondary"
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
      <p className="text-xs text-v1-content-secondary">
        {shortenAddress(wallet.address)}
      </p>
      <div className="mt-4 grid grid-cols-5 gap-3">
        <div className="col-span-5 flex h-40 flex-col justify-between rounded-xl bg-v1-surface-l2 p-4">
          <p className="text-xs text-v1-content-secondary">Current Balance</p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-2xl">
              {isPending ? 'Loading...' : `$${roundSensible(balance)}`}
            </p>
            <WalletActions wallet={wallet} />
          </div>
        </div>
        <div className="col-span-2 hidden rounded-xl bg-v1-surface-l2 p-4 pt-3">
          <div className="mb-7 flex items-center justify-between text-xs text-v1-content-secondary">
            Details
            <ButtonSelect
              value={period}
              variant="white"
              buttonClassName="w-12"
              options={[
                { value: null, label: 'ALL' },
                { value: 1, label: '1D' },
                { value: 7, label: '7D' },
                { value: 3, label: '30D' },
              ]}
              surface={3}
              size="xs"
              onChange={newValue => setPeriod(newValue)}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xxs">
              <p className="pb-3 text-v1-content-secondary">Realized PnL</p>
              <p className="text-lg font-medium text-v1-content-positive">
                0% (0 USD)
              </p>
            </div>
            <div className="h-10 border-r border-v1-inverse-overlay-10" />
            <div className="text-xxs">
              <p className="pb-3 text-v1-content-secondary">Win Rate</p>
              <p className="text-lg font-medium">0%</p>
            </div>
            <div className="h-10 border-r border-v1-inverse-overlay-10" />
            <div className="text-xxs">
              <p className="pb-3 text-v1-content-secondary">TXs</p>
              <p className="text-lg font-medium">
                <span className="text-v1-content-positive">0</span>/
                <span className="text-v1-content-negative">0</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Tabs className="mt-4 hidden" defaultActiveKey="1" items={items} />
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
      ref={inputRef}
      className="bg-transparent"
      defaultValue={newName}
      onChange={e => setNewName(e.target.value)}
      onBlur={updateName}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          updateName();
        }
      }}
    />
  ) : (
    <div className="flex items-center gap-2">
      <span>{wallet.name}</span>
      <HoverTooltip className="inline" title="Rename" ignoreFocus>
        <button
          onClick={() => {
            setEditMode(prev => !prev);
            setTimeout(() => inputRef.current?.select(), 0);
          }}
          className="text-v1-content-secondary"
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
        onClick={() => withdraw(wallet.address)}
        variant="outline"
        size="md"
        className="!bg-transparent"
      >
        Withdraw
      </Button>
      <Button
        onClick={() => transfer(wallet.address)}
        variant="outline"
        size="md"
        className="!bg-transparent"
      >
        Transfer
      </Button>
      {withdrawDepositModal}
    </div>
  );
}
