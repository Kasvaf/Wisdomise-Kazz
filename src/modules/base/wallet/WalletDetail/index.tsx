import { Tabs } from 'antd';
import {
  useUpdateWalletMutation,
  useWalletQuery,
  type Wallet,
} from 'api/wallets';
import { bxCopy, bxEdit, bxLinkExternal } from 'boxicons-quasar';
import { SCANNERS } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import WalletPositions from 'modules/autoTrader/Positions/WalletPositions';
import Swaps from 'modules/autoTrader/Swaps';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaUserAssets';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { useRef, useState } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { roundSensible } from 'utils/numbers';
import { shortenAddress } from 'utils/shortenAddress';

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
  const [window, setWindow] = useState(24);

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
      <div className="mt-4 grid grid-cols-5 gap-3">
        <div className="col-span-5 flex h-40 flex-col justify-between rounded-xl bg-v1-surface-l1 p-4">
          <p className="text-v1-content-secondary text-xs">Current Balance</p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-2xl">
              {isPending ? 'Loading...' : `$${roundSensible(balance)}`}
            </p>
            <WalletActions wallet={wallet} />
          </div>
        </div>
        <div className="col-span-2 hidden rounded-xl bg-v1-surface-l1 p-4 pt-3">
          <div className="mb-7 flex items-center justify-between text-v1-content-secondary text-xs">
            Details
            <ButtonSelect
              buttonClassName="w-12"
              onChange={newValue => setWindow(newValue)}
              options={[
                { value: 24, label: '1D' },
                { value: 24 * 7, label: '7D' },
              ]}
              size="xs"
              surface={3}
              value={window}
              variant="white"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xxs">
              <p className="pb-3 text-v1-content-secondary">Realized PnL</p>
              <p className="font-medium text-lg text-v1-content-positive">
                0% (0 USD)
              </p>
            </div>
            <div className="h-10 border-v1-inverse-overlay-10 border-r" />
            <div className="text-xxs">
              <p className="pb-3 text-v1-content-secondary">Win Rate</p>
              <p className="font-medium text-lg">0%</p>
            </div>
            <div className="h-10 border-v1-inverse-overlay-10 border-r" />
            <div className="text-xxs">
              <p className="pb-3 text-v1-content-secondary">TXs</p>
              <p className="font-medium text-lg">
                <span className="text-v1-content-positive">0</span>/
                <span className="text-v1-content-negative">0</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Tabs
        className="mt-4"
        defaultActiveKey="2"
        items={[
          // {
          //   key: '1',
          //   label: 'Account PnL',
          //   children: <AccountPnL wallet={wallet} window={window} />,
          // },
          {
            key: '2',
            label: 'Buys/Sells',
            children: <Swaps wallet={wallet} />,
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
