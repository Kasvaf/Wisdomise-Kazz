import { bxCog, bxSort } from 'boxicons-quasar';
import { useTokenActivity } from 'modules/autoTrader/TokenActivity/useWatchTokenStream';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import Icon from 'modules/shared/Icon';
import { ReactComponent as SolanaIcon } from 'modules/shared/NetworkIcon/solana.svg';
import { Button } from 'modules/shared/v1-components/Button';
import { Dialog } from 'modules/shared/v1-components/Dialog';
import { Toggle } from 'modules/shared/v1-components/Toggle';
import { useState } from 'react';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { WatchEventType } from 'services/grpc/proto/wealth_manager';
import { useHasFlag, useTokenPairsQuery } from 'services/rest';
import { useTokenInfo } from 'services/rest/token-info';
import { formatNumber } from 'utils/numbers';

export function MobilePositionBar() {
  const [showLastPosition, _setShowLastPosition] = useState(false);
  const [showPnlSettings, setShowPnlSettings] = useState(false);
  const [showExitPrice, setShowExitPrice] = useState(true);
  const [resetPnl, setResetPnl] = useState(false);
  const [showHoldingAsTokens, setShowHoldingAsTokens] = useState(false);

  const { symbol } = useUnifiedCoinDetails();
  const { settings, toggleShowActivityInUsd } = useUserSettings();
  const slug = symbol.slug;
  const activityData = useTokenActivity({
    slug,
    type: showLastPosition
      ? WatchEventType.SWAP_POSITION_UPDATE
      : WatchEventType.TRADE_ACTIVITY_UPDATE,
  });

  const hasFlag = useHasFlag();
  const { data: tokenInfo } = useTokenInfo({ slug });

  const { data: pairs, isPending } = useTokenPairsQuery(slug);

  const hasSolanaPair =
    !isPending && pairs?.some(p => p.quote.slug === WRAPPED_SOLANA_SLUG);
  const showUsd = hasSolanaPair ? settings.show_activity_in_usd : true;

  const {
    bought,
    boughtUsd,
    sold,
    soldUsd,
    balance,
    hold,
    holdUsd,
    pnl,
    pnlUsd,
    pnlPercent,
    pnlUsdPercent,
    pnlSign,
  } = activityData;

  const formatter = (value?: string | number) => {
    return formatNumber(Number(value ?? '0'), {
      decimalLength: 2,
      minifyDecimalRepeats: true,
      compactInteger: true,
      separateByComma: false,
    });
  };

  const displayCurrency = showUsd ? 'USD' : 'SOL';

  if (!hasFlag('/swap-activity')) return null;

  const pnlColor =
    pnl >= 0 ? 'text-v1-content-positive' : 'text-v1-content-negative';

  // Format token count (e.g., 130000 -> 130K)
  const _formatTokenCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  // Currency icon component - standardized size
  const CurrencyIcon = ({ size = 'w-1.5 h-1.5' }: { size?: string }) =>
    showUsd ? (
      <span className="font-semibold text-[10px]">$</span>
    ) : (
      <SolanaIcon className={`inline-block ${size}`} />
    );

  const tokenSymbol = tokenInfo?.symbol?.slice(0, 3) ?? 'N/A';

  return (
    <>
      {/* Compact position stats bar */}
      <div className="border-v1-surface-l1 border-t bg-v1-background-primary px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* PnL Settings */}
          <Button
            className="flex-shrink-0 justify-start gap-1.5 text-neutral-600"
            data-testid="button-pnl-settings"
            onClick={() => setShowPnlSettings(true)}
            size="3xs"
            variant="ghost"
          >
            <Icon name={bxCog} size={14} />
            <span className="font-medium text-[11px]">PnL</span>
          </Button>

          {/* Bought */}
          <div className="relative flex-1">
            <div className="-left-1 -translate-y-1/2 absolute top-1/2 h-4 w-px bg-v1-border-tertiary/50" />
            <button
              className="flex w-full flex-col items-center gap-0.5 hover:opacity-80"
              data-testid="button-toggle-bought"
              onClick={() => toggleShowActivityInUsd()}
              type="button"
            >
              <span className="font-medium text-[11px] text-v1-content-positive">
                Bought
              </span>
              <span className="flex items-center gap-0.5 font-bold font-mono text-[11px] text-v1-content-positive">
                <CurrencyIcon />
                {formatter(showUsd ? boughtUsd : bought)}
              </span>
            </button>
          </div>

          {/* Sold */}
          <div className="relative flex-1">
            <div className="-left-1 -translate-y-1/2 absolute top-1/2 h-4 w-px bg-v1-border-tertiary/50" />
            <button
              className="flex w-full flex-col items-center gap-0.5 hover:opacity-80"
              data-testid="button-toggle-sold"
              onClick={() => toggleShowActivityInUsd()}
              type="button"
            >
              <span className="font-medium text-[11px] text-v1-content-negative">
                Sold
              </span>
              <span className="flex items-center gap-0.5 font-bold font-mono text-[11px] text-v1-content-negative">
                <CurrencyIcon />
                {formatter(showUsd ? soldUsd : sold)}
              </span>
            </button>
          </div>

          {/* Holding */}
          <div className="relative flex-1">
            <div className="-left-1 -translate-y-1/2 absolute top-1/2 h-4 w-px bg-v1-border-tertiary/50" />
            <button
              className="flex w-full flex-col items-center gap-0.5 hover:opacity-80"
              data-testid="button-toggle-holding"
              onClick={() => setShowHoldingAsTokens(!showHoldingAsTokens)}
              type="button"
            >
              <span className="font-medium text-[11px] text-white">
                Holding
              </span>
              <span className="flex items-center gap-0.5 font-bold font-mono text-[11px] text-white">
                {showHoldingAsTokens ? (
                  `${formatter(balance)} ${tokenSymbol}`
                ) : (
                  <>
                    <CurrencyIcon />
                    {formatter(showUsd ? holdUsd : hold)}
                  </>
                )}
              </span>
            </button>
          </div>

          {/* PnL */}
          <div className="relative flex-1">
            <div className="-left-1 -translate-y-1/2 absolute top-1/2 h-4 w-px bg-v1-border-tertiary/50" />
            <button
              className="flex w-full flex-col items-center gap-0.5 hover:opacity-80"
              data-testid="button-toggle-pnl-value"
              onClick={() => toggleShowActivityInUsd()}
              type="button"
            >
              <span
                className={`flex items-center gap-0.5 font-bold font-mono text-[11px] ${pnlColor}`}
              >
                <CurrencyIcon />
                {pnlSign}
                {formatter(Math.abs(showUsd ? pnlUsd : pnl))}
              </span>
              <span className={`font-bold font-mono text-[11px] ${pnlColor}`}>
                ({pnlSign}
                {Math.abs(showUsd ? pnlUsdPercent : pnlPercent).toFixed(0)}%)
              </span>
            </button>
          </div>
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
            disabled={!hasSolanaPair}
            onClick={() => toggleShowActivityInUsd()}
            size="sm"
            surface={2}
            variant="ghost"
          >
            <Icon name={bxSort} size={14} />
            <span>{displayCurrency}</span>
          </Button>
        </div>

        {/* Preview Bar */}
        <div className="rounded-lg border-2 border-v1-content-info bg-v1-content-info/10 p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neutral-500 text-xs">Bought</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-sm text-v1-content-positive">
                <CurrencyIcon size="w-2.5 h-2.5" />
                {formatter(showUsd ? boughtUsd : bought)}
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neutral-500 text-xs">Sold</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-sm text-v1-content-negative">
                <CurrencyIcon size="w-2.5 h-2.5" />
                {formatter(showUsd ? soldUsd : sold)}
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neutral-500 text-xs">Holding</span>
              <span className="flex items-center gap-0.5 font-medium font-mono text-sm text-white">
                <CurrencyIcon size="w-2.5 h-2.5" />
                {formatter(showUsd ? holdUsd : hold)}
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neutral-500 text-xs">PnL</span>
              <span
                className={`flex items-center gap-0.5 font-medium font-mono text-sm ${pnlColor}`}
              >
                <CurrencyIcon size="w-2.5 h-2.5" />
                {pnlSign}
                {formatter(Math.abs(showUsd ? pnlUsd : pnl))} ({pnlSign}
                {Math.abs(showUsd ? pnlUsdPercent : pnlPercent).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
