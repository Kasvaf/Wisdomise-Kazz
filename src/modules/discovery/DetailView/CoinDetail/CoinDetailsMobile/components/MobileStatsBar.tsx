import { ReactComponent as SolanaIcon } from 'modules/shared/NetworkIcon/solana.svg';
import { useUnifiedCoinDetails } from '../../lib';

function formatNumber(num: number, prefix = '$'): string {
  if (num >= 1_000_000) {
    return `${prefix}${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${prefix}${(num / 1000).toFixed(1)}K`;
  }
  return `${prefix}${num.toFixed(2)}`;
}

export function MobileStatsBar() {
  const { marketData } = useUnifiedCoinDetails();

  return (
    <div className="flex items-center justify-between gap-2 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-1.5">
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">MC</span>
        <span className="font-mono font-semibold text-v1-content-positive text-xs">
          {formatNumber(marketData.marketCap ?? 0)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">V</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatNumber(marketData.volume24h ?? 0)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">L</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatNumber(marketData.liquidity ?? 0)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">H</span>
        <span className="font-mono font-semibold text-white text-xs">
          {(marketData.holders ?? 0).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">F</span>
        <div className="flex items-center gap-0.5">
          <SolanaIcon className="inline-block h-1.5 w-1.5" />
          <span className="font-mono font-semibold text-white text-xs">
            {(marketData.fees ?? 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
