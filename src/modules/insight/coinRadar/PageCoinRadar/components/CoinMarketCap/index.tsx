import { clsx } from 'clsx';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type MarketData } from 'api/types/shared';
import { ReactComponent as CapIcon } from './cap.svg';

export function CoinMarketCap({
  className,
  marketData,
}: {
  className?: string;
  linesClassName?: string;
  marketData: MarketData;
}) {
  return (
    <span className={clsx('inline-flex flex-col gap-px', className)}>
      <span className="text-sm text-v1-content-primary">
        {marketData.market_cap_category ?? '-'}
      </span>
      <div className="flex items-center gap-1 text-xs text-v1-content-secondary">
        <CapIcon />
        <ReadableNumber value={marketData.current_price} label="$" />
      </div>
    </span>
  );
}
