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
    <div className="flex items-center justify-between gap-2 border-[#252525] border-b bg-[#0e0e0e] px-3 py-1.5">
      <div className="flex items-center gap-1">
        <span className="font-medium text-[#606060] text-[10px]">MC</span>
        <span className="font-mono font-semibold text-[#00D179] text-xs">
          {formatNumber(marketCap)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[#606060] text-[10px]">V</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatNumber(volume)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[#606060] text-[10px]">L</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatNumber(liquidity)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[#606060] text-[10px]">H</span>
        <span className="font-mono font-semibold text-white text-xs">
          {holders.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[#606060] text-[10px]">F</span>
        <div className="flex items-center gap-0.5">
          <span className="font-semibold text-[#9945FF] text-[10px]">SOL</span>
          <span className="font-mono font-semibold text-white text-xs">
            {fees.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
