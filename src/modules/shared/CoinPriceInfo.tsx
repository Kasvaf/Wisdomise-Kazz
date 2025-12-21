import { clsx } from 'clsx';
import type { MiniMarketData } from 'services/rest/discovery';
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
          className="text-sm"
          label="$"
          value={marketData?.current_price}
        />
        <DirectionalNumber
          label="%"
          showIcon={false}
          showSign
          suffix="(24H)"
          value={marketData?.price_change_percentage_24h}
        />
      </div>
      <div
        className={clsx(
          'flex items-center gap-2 font-light text-v1-content-secondary text-xs',
          linesClassName,
        )}
      >
        <DirectionalNumber
          direction="down"
          label="$"
          value={marketData?.low_24h}
        />
        <DirectionalNumber
          direction="up"
          label="$"
          value={marketData?.high_24h}
        />
      </div>
    </span>
  );
}
