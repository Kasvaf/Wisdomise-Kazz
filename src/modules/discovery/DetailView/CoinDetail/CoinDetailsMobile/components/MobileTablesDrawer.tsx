import {
  AlertTriangle,
  ExternalLink,
  Lock,
  Settings,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { useState } from 'react';
import { Toggle } from './Toggle';

interface Position {
  id: string;
  token: string;
  tokenSymbol: string;
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

const DEMO_POSITIONS: Position[] = [
  {
    id: '1',
    token: 'CUM',
    tokenSymbol: 'CUM',
    bought: 150_000,
    boughtValue: '$45.00',
    sold: 0,
    soldValue: '$0',
    pnl: 12.5,
    pnlPercent: 27.8,
  },
  {
    id: '2',
    token: 'PEPE',
    tokenSymbol: 'PEPE',
    bought: 250_000,
    boughtValue: '$75.00',
    sold: 100_000,
    soldValue: '$35.00',
    pnl: -5.25,
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
    <div className="flex h-full flex-col bg-[#000000]">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-[#252525] border-b px-3 py-2">
        {tabs.map(tab => (
          <button
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-xs transition-all ${
              activeTab === tab.id
                ? 'bg-[#252525] text-white'
                : 'text-[#606060] hover:text-white'
            }`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <div className="flex-1 overflow-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="sticky top-0 z-10 grid grid-cols-[1fr_80px_80px_90px_60px] gap-2 border-[#252525] border-b bg-[#000000] px-3 py-2 font-medium text-[#606060] text-[10px]">
              <div>Token</div>
              <div className="text-right">Bought</div>
              <div className="text-right">Sold</div>
              <div className="text-right">PnL</div>
              <div className="text-center">Actions</div>
            </div>

            {/* Positions List */}
            {DEMO_POSITIONS.map(position => (
              <div
                className="grid grid-cols-[1fr_80px_80px_90px_60px] items-center gap-2 border-[#0a0a0a] border-b px-3 py-2.5 transition-colors hover:bg-[#0e0e0e]"
                key={position.id}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#252525]">
                    <span className="font-bold text-[10px] text-white">
                      {position.tokenSymbol.slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-xs">
                      {position.token}
                    </span>
                    <span className="text-[#606060] text-[10px]">
                      {position.tokenSymbol}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white text-xs">
                    {position.bought.toLocaleString()}
                  </div>
                  <div className="text-[#606060] text-[10px]">
                    {position.boughtValue}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white text-xs">
                    {position.sold.toLocaleString()}
                  </div>
                  <div className="text-[#606060] text-[10px]">
                    {position.soldValue}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono font-semibold text-xs ${
                      position.pnl >= 0 ? 'text-[#00D179]' : 'text-[#ef4444]'
                    }`}
                  >
                    {position.pnl >= 0 ? '+' : ''}
                    {position.pnl.toFixed(2)}
                  </div>
                  <div
                    className={`text-[10px] ${
                      position.pnlPercent >= 0
                        ? 'text-[#00D179]'
                        : 'text-[#ef4444]'
                    }`}
                  >
                    {position.pnlPercent >= 0 ? '+' : ''}
                    {position.pnlPercent.toFixed(1)}%
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button className="p-1 text-[#606060] transition-colors hover:text-white">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
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
            <div className="sticky top-0 z-10 grid grid-cols-[24px_minmax(100px,1fr)_90px_80px_75px] gap-2 border-[#252525] border-b bg-[#000000] px-3 py-2 font-medium text-[#606060] text-[10px]">
              <button
                className="flex items-center justify-center transition-colors hover:text-white"
                onClick={() => setShowSettingsDrawer(true)}
              >
                <Settings className="h-3 w-3" />
              </button>
              <div>Wallet</div>
              <div className="text-right">SOL Balance</div>
              <div className="text-right">Bought</div>
              <div className="text-right">U. PnL</div>
            </div>

            {/* Holders List */}
            {DEMO_HOLDERS.map(holder => (
              <div
                className="grid grid-cols-[24px_minmax(100px,1fr)_90px_80px_75px] items-center gap-2 border-[#0a0a0a] border-b px-3 py-2.5 transition-colors hover:bg-[#0e0e0e]"
                key={holder.id}
              >
                <div className="text-center text-[#606060] text-xs">
                  {holder.rank}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`truncate font-mono text-xs ${
                      holder.isLiquidityPool ? 'text-[#00D179]' : 'text-white'
                    }`}
                  >
                    {holder.wallet}
                  </span>
                  {holder.hasShield && (
                    <Shield className="h-3 w-3 text-[#5865F2]" />
                  )}
                  {holder.hasWarning && (
                    <AlertTriangle className="h-3 w-3 text-[#ef4444]" />
                  )}
                  {holder.isLocked && (
                    <Lock className="h-3 w-3 text-[#ef4444]" />
                  )}
                  {holder.hasSparkle && (
                    <Sparkles className="h-3 w-3 text-[#BEFF21]" />
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-semibold text-[#9945FF] text-[10px]">
                      SOL
                    </span>
                    <span className="font-mono text-white text-xs">
                      {holder.solBalance.toFixed(holder.solBalance < 1 ? 3 : 2)}
                    </span>
                  </div>
                  <span className="text-[#606060] text-[10px]">
                    ({holder.lastActive})
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[#00D179] text-xs">
                    {holder.boughtValue}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-semibold text-xs ${
                      holder.unrealizedPnl >= 0
                        ? 'text-[#00D179]'
                        : 'text-[#ef4444]'
                    }`}
                  >
                    {holder.unrealizedPnl >= 0 ? '+' : ''}$
                    {holder.unrealizedPnl >= 1000
                      ? `${(holder.unrealizedPnl / 1000).toFixed(2)}K`
                      : holder.unrealizedPnl.toFixed(2)}
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
            <div className="sticky top-0 z-10 grid grid-cols-[24px_minmax(100px,1fr)_90px_80px] gap-2 border-[#252525] border-b bg-[#000000] px-3 py-2 font-medium text-[#606060] text-[10px]">
              <div></div>
              <div>Wallet</div>
              <div className="text-right">SOL Balance</div>
              <div className="text-right">Bought</div>
            </div>

            {/* Traders List */}
            {DEMO_HOLDERS.map(holder => (
              <div
                className="grid grid-cols-[24px_minmax(100px,1fr)_90px_80px] items-center gap-2 border-[#0a0a0a] border-b px-3 py-2.5 transition-colors hover:bg-[#0e0e0e]"
                key={holder.id}
              >
                <div className="text-center text-[#606060] text-xs">
                  {holder.rank}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-mono text-white text-xs">
                    {holder.wallet}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-semibold text-[#9945FF] text-[10px]">
                      SOL
                    </span>
                    <span className="font-mono text-white text-xs">
                      {holder.solBalance.toFixed(holder.solBalance < 1 ? 3 : 2)}
                    </span>
                  </div>
                  <span className="text-[#606060] text-[10px]">
                    ({holder.lastActive})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[#00D179] text-xs">
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
            <div className="text-[#606060] text-sm">
              Bubble chart coming soon
            </div>
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      <Dialog
        className="bg-[#1f1f1f]"
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
          <Toggle checked={solBalance} onChange={setSolBalance} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Bought</span>
          <Toggle checked={bought} onChange={setBought} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Sold</span>
          <Toggle checked={sold} onChange={setSold} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">PnL</span>
          <Toggle checked={pnl} onChange={setPnl} />
        </div>
      </Dialog>
    </div>
  );
}
