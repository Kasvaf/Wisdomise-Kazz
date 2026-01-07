import { compressByLabel } from 'utils/numbers';
import { useUnifiedCoinDetails } from '../../lib';

const formatCompact = (num: number, prefix = '$') => {
  const { value, label } = compressByLabel(num);
  // Ensure 1 decimal place
  const numValue = Number.parseFloat(value);
  const formattedValue = numValue.toFixed(1);
  return `${prefix}${formattedValue}${label}`;
};

export function MobileStatsBar() {
  const { marketData, validatedData } = useUnifiedCoinDetails();

  return (
    <div className="flex items-center justify-between gap-2 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-1.5">
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">MC</span>
        <span className="font-mono font-semibold text-v1-content-positive text-xs">
          {formatCompact(marketData.marketCap ?? 0)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">V</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatCompact(marketData.volume24h ?? 0)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">TS</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatCompact(marketData.totalSupply ?? 0, '')}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">H</span>
        <span className="font-mono font-semibold text-white text-xs">
          {(validatedData?.numberOfHolders ?? 0).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">BC</span>
        <span className="font-mono font-semibold text-white text-xs">
          {((marketData.boundingCurve ?? 0) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
