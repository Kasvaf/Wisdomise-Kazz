import { clsx } from 'clsx';
import { type MiniMarketData } from 'api/discovery';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';

export function CoinPriceInfo({
  className,
  linesClassName,
  marketData,
}: {
  className?: string;
  linesClassName?: string;
  marketData?: null | Pick<
    MiniMarketData,
    'current_price' | 'price_change_percentage_24h' | 'low_24h' | 'high_24h'
  >;
}) {
  return (
    <span className={clsx('inline-flex flex-col', className)}>
      <div className={clsx('flex items-center gap-2 text-xs', linesClassName)}>
        <ReadableNumber
          value={marketData?.current_price}
          label="$"
          className="text-sm"
        />
        <DirectionalNumber
          value={marketData?.price_change_percentage_24h}
          showSign
          showIcon={false}
          suffix="(24H)"
          label="%"
        />
      </div>
      <div
        className={clsx(
          'flex items-center gap-2 text-xs font-light text-v1-content-secondary',
          linesClassName,
        )}
      >
        <DirectionalNumber
          direction="down"
          value={marketData?.low_24h}
          label="$"
        />
        <DirectionalNumber
          direction="up"
          value={marketData?.high_24h}
          label="$"
        />
      </div>
    </span>
  );
}
