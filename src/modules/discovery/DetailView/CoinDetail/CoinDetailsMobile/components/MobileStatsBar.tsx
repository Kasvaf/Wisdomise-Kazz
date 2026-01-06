import { ReactComponent as SolanaIcon } from 'modules/shared/NetworkIcon/solana.svg';

interface MobileStatsBarProps {
  marketCap?: number;
  volume?: number;
  liquidity?: number;
  holders?: number;
  fees?: number;
}

function formatNumber(num: number, prefix = '$'): string {
  if (num >= 1_000_000) {
    return `${prefix}${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${prefix}${(num / 1000).toFixed(1)}K`;
  }
  return `${prefix}${num.toFixed(2)}`;
}

export function MobileStatsBar({
  marketCap = 28_800,
  volume = 713.5,
  liquidity = 16_600,
  holders = 996,
  fees = 16.88,
}: MobileStatsBarProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-1.5">
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">MC</span>
        <span className="font-mono font-semibold text-v1-content-positive text-xs">
          {formatNumber(marketCap)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">V</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatNumber(volume)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">L</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatNumber(liquidity)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">H</span>
        <span className="font-mono font-semibold text-white text-xs">
          {holders.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">F</span>
        <div className="flex items-center gap-0.5">
          <SolanaIcon className="inline-block h-1.5 w-1.5" />
          <span className="font-mono font-semibold text-white text-xs">
            {fees.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
