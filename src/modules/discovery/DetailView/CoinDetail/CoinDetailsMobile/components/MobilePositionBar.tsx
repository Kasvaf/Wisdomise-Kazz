import { bxCog, bxMenu, bxSort } from 'boxicons-quasar';
import Icon from 'modules/shared/Icon';
import { Button } from 'modules/shared/v1-components/Button';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { Toggle } from 'modules/shared/v1-components/Toggle';
import { useState } from 'react';

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

  const pnlColor = pnl >= 0 ? 'text-v1-background-brand' : 'text-[#ef4444]';
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
      <div className="border-v1-surface-l1 border-t bg-v1-background-primary px-3 py-2">
        <div className="grid grid-cols-5 items-center gap-3">
          {/* PnL Settings */}
          <Button
            className="justify-start gap-1.5 text-neutral-600"
            data-testid="button-pnl-settings"
            onClick={() => setShowPnlSettings(true)}
            size="3xs"
            variant="ghost"
          >
            <Icon name={bxCog} size={14} />
            <span className="font-medium text-[11px]">PnL</span>
          </Button>

          {/* Bought */}
          <Button
            className="gap-1 hover:opacity-80"
            data-testid="button-toggle-bought"
            onClick={() =>
              setDisplayCurrency(displayCurrency === 'SOL' ? 'USD' : 'SOL')
            }
            size="3xs"
            variant="ghost"
          >
            <Icon className="text-cyan-400" name={bxMenu} size={14} />
            <span className="font-medium text-[#00D179] text-[11px]">
              Bought
            </span>
            <span className="flex items-center gap-0.5 font-bold font-mono text-[#00D179] text-[11px]">
              {displayCurrency === 'USD' ? (
                '$'
              ) : (
                <Icon name={bxMenu} size={10} />
              )}
              {bought}
            </span>
          </Button>

          {/* Sold */}
          <Button
            className="gap-1 hover:opacity-80"
            data-testid="button-toggle-sold"
            onClick={() =>
              setDisplayCurrency(displayCurrency === 'SOL' ? 'USD' : 'SOL')
            }
            size="3xs"
            variant="ghost"
          >
            <Icon className="text-cyan-400" name={bxMenu} size={14} />
            <span className="font-medium text-[#ef4444] text-[11px]">Sold</span>
            <span className="flex items-center gap-0.5 font-bold font-mono text-[#ef4444] text-[11px]">
              {displayCurrency === 'USD' ? (
                '$'
              ) : (
                <Icon name={bxMenu} size={10} />
              )}
              {sold}
            </span>
          </Button>

          {/* Holding */}
          <Button
            className="gap-1 hover:opacity-80"
            data-testid="button-toggle-holding"
            onClick={() => setShowHoldingAsTokens(!showHoldingAsTokens)}
            size="3xs"
            variant="ghost"
          >
            <Icon className="text-cyan-400" name={bxMenu} size={14} />
            <span className="font-medium text-[11px] text-white">Holding</span>
            <span className="flex items-center gap-0.5 font-bold font-mono text-[11px] text-white">
              {showHoldingAsTokens ? (
                `${formatTokenCount(holdingTokens)} ${tokenSymbol}`
              ) : (
                <>
                  {displayCurrency === 'USD' ? (
                    '$'
                  ) : (
                    <Icon name={bxMenu} size={10} />
                  )}
                  {holding}
                </>
              )}
            </span>
          </Button>

          {/* PnL */}
          <Button
            className="gap-1 hover:opacity-80"
            data-testid="button-toggle-pnl-value"
            onClick={() =>
              setDisplayCurrency(displayCurrency === 'SOL' ? 'USD' : 'SOL')
            }
            size="3xs"
            variant="ghost"
          >
            <Icon className={pnlColor} name={bxMenu} size={14} />
            <span className="flex items-center gap-0.5 font-bold font-mono text-[11px] text-white">
              {displayCurrency === 'USD' ? (
                '$'
              ) : (
                <Icon name={bxMenu} size={10} />
              )}
              {pnlSign}
              {pnl}
            </span>
            <span className="font-mono text-[11px] text-white">
              ({pnlSign}
              {pnlPercent}%)
            </span>
          </Button>
        </div>
      </div>

      {/* PnL Settings Drawer */}
      <Dialog
        className="bg-v1-surface-l1"
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
            data-testid="switch-show-exit-price"
            onChange={setShowExitPrice}
            value={showExitPrice}
          />
        </div>

        {/* Reset PNL toggle */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Reset PNL</span>
            <Toggle
              data-testid="switch-reset-pnl"
              onChange={setResetPnl}
              value={resetPnl}
            />
          </div>
          <span className="text-neutral-600 text-xs">
            PNL resets to 0 when the position is fully closed
          </span>
        </div>

        {/* Cumulative PNL with currency toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Cumulative PNL</span>
          <Button
            className="gap-1.5"
            data-testid="button-toggle-currency"
            onClick={() =>
              setDisplayCurrency(displayCurrency === 'SOL' ? 'USD' : 'SOL')
            }
            size="sm"
            surface={2}
            variant="ghost"
          >
            <Icon name={bxSort} size={14} />
            <span>{displayCurrency}</span>
          </Button>
        </div>

        {/* Preview Bar */}
        <div className="rounded-lg border-2 border-[#4F6EF7] bg-[#4F6EF7]/10 p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neutral-500 text-xs">Bought</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-[#00D179] text-sm">
                {displayCurrency === 'USD' ? (
                  '$'
                ) : (
                  <span className="font-semibold text-[10px] text-v1-background-secondary">
                    SOL
                  </span>
                )}
                0
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neutral-500 text-xs">Sold</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-red-400 text-sm">
                {displayCurrency === 'USD' ? (
                  '$'
                ) : (
                  <span className="font-semibold text-[10px] text-v1-background-secondary">
                    SOL
                  </span>
                )}
                0
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neutral-500 text-xs">Holding</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-sm text-white">
                {displayCurrency === 'USD' ? (
                  '$'
                ) : (
                  <span className="font-semibold text-[10px] text-v1-background-secondary">
                    SOL
                  </span>
                )}
                0
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neutral-500 text-xs">PnL</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-[#00D179] text-sm">
                {displayCurrency === 'USD' ? (
                  '$'
                ) : (
                  <span className="font-semibold text-[10px] text-v1-background-secondary">
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
