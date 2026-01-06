import { ArrowUpDown, Menu, Settings } from 'lucide-react';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { useState } from 'react';
import { Toggle } from './Toggle';

interface MobilePositionBarProps {
  bought?: number;
  sold?: number;
  holding?: number;
  holdingTokens?: number;
  tokenSymbol?: string;
  pnl?: number;
  pnlPercent?: number;
}

export function MobilePositionBar({
  bought = 0,
  sold = 0,
  holding = 0,
  holdingTokens = 0,
  tokenSymbol = 'ROY',
  pnl = 0,
  pnlPercent = 0,
}: MobilePositionBarProps) {
  const [showPnlSettings, setShowPnlSettings] = useState(false);
  const [showExitPrice, setShowExitPrice] = useState(true);
  const [resetPnl, setResetPnl] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<'SOL' | 'USD'>('SOL');
  const [showHoldingAsTokens, setShowHoldingAsTokens] = useState(true);

  const pnlColor = pnl >= 0 ? 'text-[#beff21]' : 'text-[#ef4444]';
  const pnlSign = pnl >= 0 ? '+' : '';

  // Format token count (e.g., 130000 -> 130K)
  const formatTokenCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <>
      {/* Compact position stats bar */}
      <div className="border-[#1a1a1a] border-t bg-[#0a0a0a] px-3 py-2">
        <div className="grid grid-cols-5 items-center gap-3">
          {/* PnL Settings */}
          <button
            className="flex items-center justify-start gap-1.5 text-[#606060] transition-colors hover:text-white"
            data-testid="button-pnl-settings"
            onClick={() => setShowPnlSettings(true)}
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="font-medium text-[11px]">PnL</span>
          </button>

          {/* Bought */}
          <button
            className="flex items-center gap-1 transition-opacity hover:opacity-80"
            data-testid="button-toggle-bought"
            onClick={() =>
              setDisplayCurrency(displayCurrency === 'SOL' ? 'USD' : 'SOL')
            }
          >
            <Menu className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium text-[#00D179] text-[11px]">
              Bought
            </span>
            <span className="flex items-center gap-0.5 font-bold font-mono text-[#00D179] text-[11px]">
              {displayCurrency === 'USD' ? (
                '$'
              ) : (
                <Menu className="h-2.5 w-2.5" />
              )}
              {bought}
            </span>
          </button>

          {/* Sold */}
          <button
            className="flex items-center gap-1 transition-opacity hover:opacity-80"
            data-testid="button-toggle-sold"
            onClick={() =>
              setDisplayCurrency(displayCurrency === 'SOL' ? 'USD' : 'SOL')
            }
          >
            <Menu className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium text-[#ef4444] text-[11px]">Sold</span>
            <span className="flex items-center gap-0.5 font-bold font-mono text-[#ef4444] text-[11px]">
              {displayCurrency === 'USD' ? (
                '$'
              ) : (
                <Menu className="h-2.5 w-2.5" />
              )}
              {sold}
            </span>
          </button>

          {/* Holding */}
          <button
            className="flex items-center gap-1 transition-opacity hover:opacity-80"
            data-testid="button-toggle-holding"
            onClick={() => setShowHoldingAsTokens(!showHoldingAsTokens)}
          >
            <Menu className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium text-[11px] text-white">Holding</span>
            <span className="flex items-center gap-0.5 font-bold font-mono text-[11px] text-white">
              {showHoldingAsTokens ? (
                `${formatTokenCount(holdingTokens)} ${tokenSymbol}`
              ) : (
                <>
                  {displayCurrency === 'USD' ? (
                    '$'
                  ) : (
                    <Menu className="h-2.5 w-2.5" />
                  )}
                  {holding}
                </>
              )}
            </span>
          </button>

          {/* PnL */}
          <button
            className="flex items-center gap-1 transition-opacity hover:opacity-80"
            data-testid="button-toggle-pnl-value"
            onClick={() =>
              setDisplayCurrency(displayCurrency === 'SOL' ? 'USD' : 'SOL')
            }
          >
            <Menu className={`h-3.5 w-3.5 ${pnlColor}`} />
            <span className="flex items-center gap-0.5 font-bold font-mono text-[11px] text-white">
              {displayCurrency === 'USD' ? (
                '$'
              ) : (
                <Menu className="h-2.5 w-2.5" />
              )}
              {pnlSign}
              {pnl}
            </span>
            <span className="font-mono text-[11px] text-white">
              ({pnlSign}
              {pnlPercent}%)
            </span>
          </button>
        </div>
      </div>

      {/* PnL Settings Drawer */}
      <Dialog
        className="bg-[#1f1f1f]"
        contentClassName="flex flex-col gap-4 px-4 py-4"
        drawerConfig={{ position: 'bottom', closeButton: true }}
        header={
          <span className="font-semibold text-base text-white">
            PnL Settings
          </span>
        }
        mode="drawer"
        onClose={() => setShowPnlSettings(false)}
        open={showPnlSettings}
      >
        {/* Show exit price toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Show exit price in PNL</span>
          <Toggle
            checked={showExitPrice}
            data-testid="switch-show-exit-price"
            onChange={setShowExitPrice}
          />
        </div>

        {/* Reset PNL toggle */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Reset PNL</span>
            <Toggle
              checked={resetPnl}
              data-testid="switch-reset-pnl"
              onChange={setResetPnl}
            />
          </div>
          <span className="text-[#606060] text-xs">
            PNL resets to 0 when the position is fully closed
          </span>
        </div>

        {/* Cumulative PNL with currency toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Cumulative PNL</span>
          <button
            className="flex items-center gap-1.5 rounded-md bg-[#252525] px-2.5 py-1.5 font-medium text-white text-xs transition-colors hover:bg-[#303030]"
            data-testid="button-toggle-currency"
            onClick={() =>
              setDisplayCurrency(displayCurrency === 'SOL' ? 'USD' : 'SOL')
            }
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>{displayCurrency}</span>
          </button>
        </div>

        {/* Preview Bar */}
        <div className="rounded-lg border-2 border-[#4F6EF7] bg-[#4F6EF7]/10 p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[#808080] text-xs">Bought</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-[#00D179] text-sm">
                {displayCurrency === 'USD' ? (
                  '$'
                ) : (
                  <span className="font-semibold text-[#9945FF] text-[10px]">
                    SOL
                  </span>
                )}
                0
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[#808080] text-xs">Sold</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-red-400 text-sm">
                {displayCurrency === 'USD' ? (
                  '$'
                ) : (
                  <span className="font-semibold text-[#9945FF] text-[10px]">
                    SOL
                  </span>
                )}
                0
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[#808080] text-xs">Holding</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-sm text-white">
                {displayCurrency === 'USD' ? (
                  '$'
                ) : (
                  <span className="font-semibold text-[#9945FF] text-[10px]">
                    SOL
                  </span>
                )}
                0
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[#808080] text-xs">PnL</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-[#00D179] text-sm">
                {displayCurrency === 'USD' ? (
                  '$'
                ) : (
                  <span className="font-semibold text-[#9945FF] text-[10px]">
                    SOL
                  </span>
                )}
                +0 (+0%)
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
