import { clsx } from 'clsx';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type MarketData } from 'api/types/shared';

export function CoinPriceInfo({
  className,
  linesClassName,
  marketData,
}: {
  className?: string;
  linesClassName?: string;
  marketData: MarketData;
}) {
  return (
    <span className={clsx('inline-flex flex-col', className)}>
      <div className={clsx('flex items-center gap-2', linesClassName)}>
        <ReadableNumber value={marketData.current_price} label="$" />
        <DirectionalNumber
          value={marketData.price_change_percentage_24h}
          showSign
          className="text-[0.89em]"
          showIcon={false}
          suffix="(24H)"
          label="%"
        />
      </div>
      <div
        className={clsx(
          'flex items-center gap-2 text-[0.89em] font-light text-v1-content-secondary',
          linesClassName,
        )}
      >
        <DirectionalNumber
          direction="down"
          value={marketData.low_24h}
          label="$"
        />
        <DirectionalNumber
          direction="up"
          value={marketData.high_24h}
          label="$"
        />
      </div>
    </span>
  );
}
