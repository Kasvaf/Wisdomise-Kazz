import {
  bxCog,
  bxError,
  bxHide,
  bxLock,
  bxShow,
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
import { useState } from 'react';
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
    boughtValue: '$135.5',
    sold: 0,
    soldValue: '$0',
    unrealizedPnl: 1210,
    remaining: '$1.17K',
    remainingPercent: 3.42,
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
    boughtValue: '$301.6',
    sold: 0,
    soldValue: '$0',
    unrealizedPnl: 939.6,
    remaining: '$1.08K',
    remainingPercent: 31.43,
    hasSparkle: true,
  },
];

type TabType = 'positions' | 'top-holders' | 'top-traders' | 'bubble-chart';

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

  const tabs: { id: TabType; label: string }[] = [
    { id: 'positions', label: 'Positions' },
    { id: 'top-holders', label: 'Top Holders' },
    { id: 'top-traders', label: 'Top Traders' },
    { id: 'bubble-chart', label: 'Bubble chart' },
  ];

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
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="sticky top-0 z-10 grid grid-cols-[24px_minmax(100px,1fr)_90px_80px_75px] gap-2 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-2 font-medium text-[10px] text-neutral-600">
              <Button
                className="flex items-center justify-center"
                fab={true}
                onClick={() => setShowSettingsDrawer(true)}
                size="3xs"
                variant="ghost"
              >
                <Icon name={bxCog} size={12} />
              </Button>
              <div>Wallet</div>
              <div className="text-right">SOL Balance</div>
              <div className="text-right">Bought</div>
              <div className="text-right">U. PnL</div>
            </div>

            {/* Holders List */}
            {DEMO_HOLDERS.map(holder => (
              <div
                className="grid grid-cols-[24px_minmax(100px,1fr)_90px_80px_75px] items-center gap-2 border-v1-background-primary border-b px-3 py-2.5 transition-colors hover:bg-v1-background-primary"
                key={holder.id}
              >
                <div className="text-center text-neutral-600 text-xs">
                  {holder.rank}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`truncate font-mono text-xs ${
                      holder.isLiquidityPool
                        ? 'text-v1-content-positive'
                        : 'text-white'
                    }`}
                  >
                    {holder.wallet}
                  </span>
                  {holder.hasShield && (
                    <Icon
                      className="text-v1-content-info"
                      name={bxsShield}
                      size={12}
                    />
                  )}
                  {holder.hasWarning && (
                    <Icon
                      className="text-v1-content-negative"
                      name={bxError}
                      size={12}
                    />
                  )}
                  {holder.isLocked && (
                    <Icon
                      className="text-v1-content-negative"
                      name={bxLock}
                      size={12}
                    />
                  )}
                  {holder.hasSparkle && (
                    <Icon
                      className="text-v1-background-brand"
                      name={bxStar}
                      size={12}
                    />
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <SolanaIcon className="inline-block h-3 w-3" />
                    <span className="font-mono text-white text-xs">
                      {holder.solBalance >= 1
                        ? holder.solBalance.toFixed(1)
                        : holder.solBalance.toFixed(3)}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-600">
                    ({holder.lastActive})
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-v1-content-positive text-xs">
                    {holder.boughtValue}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-semibold text-xs ${
                      holder.unrealizedPnl >= 0
                        ? 'text-v1-content-positive'
                        : 'text-v1-content-negative'
                    }`}
                  >
                    {holder.unrealizedPnl >= 0 ? '+' : ''}
                    {formatCurrency(holder.unrealizedPnl)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Traders Tab */}
      {activeTab === 'top-traders' && (
        <div className="flex-1 overflow-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="sticky top-0 z-10 grid grid-cols-[24px_minmax(100px,1fr)_90px_80px] gap-2 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-2 font-medium text-[10px] text-neutral-600">
              <div></div>
              <div>Wallet</div>
              <div className="text-right">SOL Balance</div>
              <div className="text-right">Bought</div>
            </div>

            {/* Traders List */}
            {DEMO_HOLDERS.map(holder => (
              <div
                className="grid grid-cols-[24px_minmax(100px,1fr)_90px_80px] items-center gap-2 border-v1-background-primary border-b px-3 py-2.5 transition-colors hover:bg-v1-background-primary"
                key={holder.id}
              >
                <div className="text-center text-neutral-600 text-xs">
                  {holder.rank}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-mono text-white text-xs">
                    {holder.wallet}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <SolanaIcon className="inline-block h-3 w-3" />
                    <span className="font-mono text-white text-xs">
                      {holder.solBalance >= 1
                        ? holder.solBalance.toFixed(1)
                        : holder.solBalance.toFixed(3)}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-600">
                    ({holder.lastActive})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-v1-content-positive text-xs">
                    {holder.boughtValue}
                  </span>
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
