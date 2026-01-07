import {
  bxError,
  bxFilter,
  bxHide,
  bxLinkExternal,
  bxLock,
  bxShow,
  bxSortAlt2,
  bxStar,
  bxsShield,
} from 'boxicons-quasar';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useHideToken } from 'modules/shared/BlacklistManager/useHideToken';
import Icon from 'modules/shared/Icon';
import { ReactComponent as SolanaIcon } from 'modules/shared/NetworkIcon/solana.svg';
import { Button } from 'modules/shared/v1-components/Button';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { Toggle } from 'modules/shared/v1-components/Toggle';
import { useMemo, useState } from 'react';
import { formatNumber } from 'utils/numbers';

interface Position {
  id: string;
  token: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenImage?: string;
  bought: number;
  boughtValue: string;
  sold: number;
  soldValue: string;
  pnl: number;
  pnlPercent: number;
}

interface Holder {
  id: string;
  rank: number;
  wallet: string;
  solBalance: number;
  lastActive: string;
  bought: number;
  boughtValue: string;
  sold: number;
  soldValue: string;
  unrealizedPnl: number;
  remaining: string;
  remainingPercent: number;
  fundingSource?: string;
  fundingTime?: string;
  fundingAmount?: number;
  fundingIcon?: string;
  isLiquidityPool?: boolean;
  isLocked?: boolean;
  hasWarning?: boolean;
  hasShield?: boolean;
  hasSparkle?: boolean;
}

const formatCurrency = (value: number): string => {
  if (value === 0) return '$0';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1000) {
    const formatted = formatNumber(absValue, {
      compactInteger: true,
      separateByComma: false,
      decimalLength: 1,
      minifyDecimalRepeats: false,
      exactDecimal: true,
    });
    return `${sign}$${formatted}`;
  }

  return `${sign}$${absValue.toFixed(2)}`;
};

const DEMO_POSITIONS: Position[] = [
  {
    id: '1',
    token: 'BBW',
    tokenSymbol: 'BBW',
    tokenAddress: '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQLuke',
    tokenImage: '/icons/tokens/wisebot.png',
    bought: 4000,
    boughtValue: '$0.3256',
    sold: 0,
    soldValue: '$0',
    pnl: 12_500,
    pnlPercent: 27.8,
  },
  {
    id: '2',
    token: 'PEPE',
    tokenSymbol: 'PEPE',
    tokenAddress: '8vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQLuke',
    tokenImage: '/icons/tokens/green-logo.png',
    bought: 250_000,
    boughtValue: '$75.00',
    sold: 100_000,
    soldValue: '$35.00',
    pnl: -5250,
    pnlPercent: -7.0,
  },
];

const DEMO_HOLDERS: Holder[] = [
  {
    id: '1',
    rank: 1,
    wallet: 'LIQUIDITY POOL',
    solBalance: 68.9,
    lastActive: '0s',
    bought: 0,
    boughtValue: '$0',
    sold: 0,
    soldValue: '$0',
    unrealizedPnl: 0,
    remaining: '$0',
    remainingPercent: 0,
    isLiquidityPool: true,
    hasShield: true,
  },
  {
    id: '2',
    rank: 2,
    wallet: 'DPvx7u...KGLr',
    solBalance: 10.57,
    lastActive: '15m',
    bought: 34.2,
    boughtValue: '$1.52K',
    sold: 0,
    soldValue: '$0',
    unrealizedPnl: 1210,
    remaining: '$10.3K',
    remainingPercent: 24.17,
    fundingSource: '7unxGS...9ViE',
    fundingTime: '49m',
    fundingAmount: 0.033,
    hasWarning: true,
    isLocked: true,
  },
  {
    id: '3',
    rank: 3,
    wallet: 'Bo8VUB...vDG2',
    solBalance: 0.089,
    lastActive: '15m',
    bought: 31.4,
    boughtValue: '$796.9',
    sold: 0,
    soldValue: '$0',
    unrealizedPnl: 939.6,
    remaining: '$1.03K',
    remainingPercent: 2.42,
    fundingSource: 'AreDUi...enLv',
    fundingTime: '9mc',
    fundingAmount: 0.01,
    hasSparkle: true,
  },
  {
    id: '4',
    rank: 4,
    wallet: 'ET5B8c...N3xi',
    solBalance: 0.018,
    lastActive: '24m',
    bought: 37,
    boughtValue: '$284.1',
    sold: 0,
    soldValue: '$0',
    unrealizedPnl: 512,
    remaining: '$1.02K',
    remainingPercent: 2.4,
    fundingSource: '2W18Kq...qLme',
    fundingTime: '1d',
    fundingAmount: 4.953,
    isLocked: true,
  },
  {
    id: '5',
    rank: 5,
    wallet: 'c3E4xF...Ft86',
    solBalance: 42.05,
    lastActive: '2h',
    bought: 24,
    boughtValue: '$278.2',
    sold: 0,
    soldValue: '$0',
    unrealizedPnl: 234,
    remaining: '$920.2',
    remainingPercent: 2.164,
    fundingSource: 'AucCPW...3xNr',
    fundingTime: '3h',
    fundingAmount: 2,
  },
];

type TabType = 'positions' | 'top-holders' | 'bubble-chart';

const HideTokenButton = ({ tokenAddress }: { tokenAddress: string }) => {
  const { addBlacklist } = useUserSettings();
  const { isHiddenByCA } = useHideToken({
    address: tokenAddress,
    network: 'solana',
  });

  return (
    <Button
      className="!p-0.5 text-neutral-600 hover:text-white"
      fab={true}
      onClick={e => {
        if (tokenAddress) {
          addBlacklist(
            { type: 'ca', network: 'solana', value: tokenAddress },
            true,
          );
        }
        e.stopPropagation();
        e.preventDefault();
      }}
      size="3xs"
      variant="ghost"
    >
      <Icon name={isHiddenByCA ? bxShow : bxHide} size={12} />
    </Button>
  );
};

export function MobileTablesDrawer() {
  const [activeTab, setActiveTab] = useState<TabType>('top-holders');
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [solBalance, setSolBalance] = useState(true);
  const [bought, setBought] = useState(true);
  const [sold, setSold] = useState(true);
  const [pnl, setPnl] = useState(true);

  // Sorting state for U. PnL column
  const [pnlSortOrder, setPnlSortOrder] = useState<'asc' | 'desc' | null>(null);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'positions', label: 'Positions' },
    { id: 'top-holders', label: 'Top Holders' },
    { id: 'bubble-chart', label: 'Bubble chart' },
  ];

  // Sort holders by Remaining (descending) by default, then by U. PnL if sort is active
  const sortedHolders = useMemo(() => {
    const sorted = [...DEMO_HOLDERS];

    // If U. PnL sort is active, sort by U. PnL
    if (pnlSortOrder) {
      sorted.sort((a, b) => {
        if (pnlSortOrder === 'asc') {
          return a.unrealizedPnl - b.unrealizedPnl;
        } else {
          return b.unrealizedPnl - a.unrealizedPnl;
        }
      });
    } else {
      // Default: sort by Remaining percentage (descending - highest first)
      sorted.sort((a, b) => b.remainingPercent - a.remainingPercent);
    }

    return sorted;
  }, [pnlSortOrder]);

  // Toggle U. PnL sort order
  const handlePnlSort = () => {
    if (pnlSortOrder === null) {
      setPnlSortOrder('desc');
    } else if (pnlSortOrder === 'desc') {
      setPnlSortOrder('asc');
    } else {
      setPnlSortOrder(null);
    }
  };

  return (
    <div className="flex h-full flex-col bg-v1-background-primary">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-v1-border-tertiary border-b px-3 py-2">
        {tabs.map(tab => (
          <Button
            className={activeTab === tab.id ? 'text-white' : 'text-neutral-600'}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            size="sm"
            surface={activeTab === tab.id ? 2 : 0}
            variant="ghost"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <div className="flex-1 overflow-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="sticky top-0 z-10 grid grid-cols-[1fr_100px_100px_120px] gap-2 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-2 font-medium text-[10px] text-neutral-600">
              <div>Token</div>
              <div className="text-right">Bought</div>
              <div className="text-right">Sold ↓</div>
              <div className="text-center">Actions</div>
            </div>

            {/* Positions List */}
            {DEMO_POSITIONS.map(position => (
              <div
                className="grid grid-cols-[1fr_100px_100px_120px] items-center gap-2 border-v1-background-primary border-b px-3 py-2.5 transition-colors hover:bg-v1-background-primary"
                key={position.id}
              >
                <div className="flex items-center gap-2">
                  {position.tokenImage ? (
                    <img
                      alt={position.tokenSymbol}
                      className="h-7 w-7 rounded-full object-cover"
                      src={position.tokenImage}
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-v1-surface-l2">
                      <span className="font-bold text-[10px] text-white">
                        {position.tokenSymbol.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-xs">
                      {position.token}
                    </span>
                    <span
                      className={`text-[10px] ${
                        position.pnl >= 0
                          ? 'text-v1-content-positive'
                          : 'text-v1-content-negative'
                      }`}
                    >
                      {position.pnl >= 0 ? '+' : ''}
                      {formatCurrency(position.pnl)} (
                      {position.pnl >= 0 ? '+' : ''}
                      {position.pnlPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-v1-content-positive text-xs">
                    {position.boughtValue}
                  </div>
                  <div className="text-[10px] text-neutral-600">
                    {position.bought.toLocaleString()} {position.tokenSymbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-v1-content-negative text-xs">
                    {position.soldValue}
                  </div>
                  <div className="text-[10px] text-neutral-600">
                    {position.sold.toLocaleString()} {position.tokenSymbol}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <HideTokenButton tokenAddress={position.tokenAddress} />
                  <Button
                    className="!text-v1-content-negative"
                    size="2xs"
                    variant="ghost"
                  >
                    Sell
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Holders Tab */}
      {activeTab === 'top-holders' && (
        <div className="flex-1 overflow-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="sticky top-0 z-10 grid grid-cols-[18px_28px_minmax(85px,100px)_minmax(95px,110px)_minmax(75px,90px)_minmax(75px,90px)_70px_minmax(70px,85px)_minmax(100px,120px)] gap-1 border-v1-border-tertiary border-b bg-v1-background-primary px-2 py-1.5 font-medium text-[9px] text-neutral-600">
              <div></div>
              <div></div>
              <div>Wallet</div>
              <div className="text-right">SOL (Active)</div>
              <div className="text-right">Bought</div>
              <div className="text-right">Sold</div>
              <Button
                className="!p-0 !text-neutral-600 hover:!text-white flex items-center justify-end gap-0.5"
                onClick={handlePnlSort}
                size="3xs"
                variant="ghost"
              >
                <span>PnL</span>
                <Icon name={bxSortAlt2} size={10} />
              </Button>
              <div className="text-right">Remain</div>
              <div className="text-right">Funding</div>
            </div>

            {/* Holders List */}
            {sortedHolders.map((holder, index) => (
              <div
                className="grid grid-cols-[18px_28px_minmax(85px,100px)_minmax(95px,110px)_minmax(75px,90px)_minmax(75px,90px)_70px_minmax(70px,85px)_minmax(100px,120px)] items-center gap-1 border-v1-background-primary border-b px-2 py-1.5 transition-colors hover:bg-v1-background-primary"
                key={holder.id}
              >
                {/* Rank */}
                <div className="text-center text-[10px] text-neutral-600">
                  {index + 1}
                </div>

                {/* Filter & External Link Icons */}
                <div className="flex items-center justify-center gap-0.5">
                  <Icon
                    className="cursor-pointer text-neutral-600 transition-colors hover:text-white"
                    name={bxFilter}
                    size={10}
                  />
                  <Icon
                    className="cursor-pointer text-neutral-600 transition-colors hover:text-white"
                    name={bxLinkExternal}
                    size={10}
                  />
                </div>

                {/* Wallet */}
                <div className="flex items-center gap-0.5">
                  <span
                    className={`truncate font-mono text-[10px] ${
                      holder.isLiquidityPool
                        ? 'text-v1-content-positive'
                        : 'text-white'
                    }`}
                  >
                    {holder.wallet}
                  </span>
                  {holder.hasShield && (
                    <Icon
                      className="shrink-0 text-v1-content-info"
                      name={bxsShield}
                      size={10}
                    />
                  )}
                  {holder.hasWarning && (
                    <Icon
                      className="shrink-0 text-v1-content-negative"
                      name={bxError}
                      size={10}
                    />
                  )}
                  {holder.isLocked && (
                    <Icon
                      className="shrink-0 text-v1-content-negative"
                      name={bxLock}
                      size={10}
                    />
                  )}
                  {holder.hasSparkle && (
                    <Icon
                      className="shrink-0 text-v1-background-brand"
                      name={bxStar}
                      size={10}
                    />
                  )}
                </div>

                {/* SOL Balance & Last Active */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <SolanaIcon className="inline-block h-2.5 w-2.5" />
                    <span className="font-mono text-[10px] text-white">
                      {holder.solBalance < 0.01
                        ? `0.0₃${Math.floor(holder.solBalance * 1000)}`
                        : holder.solBalance < 1
                          ? holder.solBalance.toFixed(3)
                          : holder.solBalance.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[9px] text-neutral-600">
                    ({holder.lastActive})
                  </span>
                </div>

                {/* Bought */}
                <div className="text-right">
                  <div className="font-mono text-[10px] text-white">
                    {holder.boughtValue}
                  </div>
                  <div className="text-[8px] text-neutral-600">
                    {holder.bought > 0
                      ? `${holder.bought}M/${Math.floor(holder.bought * 2.8)}`
                      : '0/0'}
                  </div>
                </div>

                {/* Sold */}
                <div className="text-right">
                  <div className="font-mono text-[10px] text-v1-content-negative">
                    {holder.soldValue}
                  </div>
                  <div className="text-[8px] text-neutral-600">
                    {holder.sold > 0
                      ? `${holder.sold}M/${Math.floor(holder.sold * 1.5)}`
                      : '0/0'}
                  </div>
                </div>

                {/* U. PnL */}
                <div className="text-right">
                  <span
                    className={`font-mono font-semibold text-[10px] ${
                      holder.unrealizedPnl >= 0
                        ? 'text-v1-content-positive'
                        : 'text-v1-content-negative'
                    }`}
                  >
                    {holder.unrealizedPnl >= 0 ? '+' : ''}
                    {formatCurrency(holder.unrealizedPnl)}
                  </span>
                </div>

                {/* Remaining */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <div
                      className={`h-1 w-1 rounded-full ${
                        holder.remainingPercent > 10
                          ? 'bg-v1-content-negative'
                          : holder.remainingPercent > 2
                            ? 'bg-yellow-500'
                            : 'bg-v1-content-positive'
                      }`}
                    />
                    <span className="font-mono text-[10px] text-white">
                      {holder.remaining}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[8px] text-neutral-600">
                      {holder.remainingPercent.toFixed(1)}%
                    </span>
                    <div className="h-0.5 w-10 overflow-hidden rounded-full bg-v1-surface-l2">
                      <div
                        className={`h-full ${
                          holder.remainingPercent > 10
                            ? 'bg-v1-content-negative'
                            : holder.remainingPercent > 2
                              ? 'bg-yellow-500'
                              : 'bg-v1-content-positive'
                        }`}
                        style={{
                          width: `${Math.min(holder.remainingPercent * 3, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Funding */}
                <div className="text-right">
                  {holder.fundingSource ? (
                    <>
                      <div className="flex items-center justify-end gap-0.5">
                        <Icon
                          className="text-neutral-600"
                          name={bxLinkExternal}
                          size={8}
                        />
                        <span className="truncate font-mono text-[10px] text-white">
                          {holder.fundingSource}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-0.5 text-[8px] text-neutral-600">
                        <span>{holder.fundingTime}</span>
                        <SolanaIcon className="inline-block h-2 w-2" />
                        <span>
                          {holder.fundingAmount && holder.fundingAmount < 0.01
                            ? `0.0₃${Math.floor(holder.fundingAmount * 1000)}`
                            : holder.fundingAmount?.toFixed(
                                holder.fundingAmount >= 1 ? 1 : 2,
                              )}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-[10px] text-neutral-600">N/A</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bubble Chart Tab */}
      {activeTab === 'bubble-chart' && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="text-neutral-600 text-sm">
              Bubble chart coming soon
            </div>
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      <Dialog
        className="bg-v1-surface-l1"
        contentClassName="px-4 py-4 space-y-4"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        header={
          <span className="font-semibold text-base text-white">
            Table Settings
          </span>
        }
        mode="drawer"
        onClose={() => setShowSettingsDrawer(false)}
        open={showSettingsDrawer}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">SOL Balance</span>
          <Toggle onChange={setSolBalance} value={solBalance} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Bought</span>
          <Toggle onChange={setBought} value={bought} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Sold</span>
          <Toggle onChange={setSold} value={sold} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">PnL</span>
          <Toggle onChange={setPnl} value={pnl} />
        </div>
      </Dialog>
    </div>
  );
}
