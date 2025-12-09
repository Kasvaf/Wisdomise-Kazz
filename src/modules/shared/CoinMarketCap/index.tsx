import { clsx } from 'clsx';
import type { MiniMarketData } from 'services/rest/discovery';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as CapIcon } from './cap.svg';

export function CoinMarketCap({
  className,
  marketData,
  singleLine: _singleLine,
}: {
  className?: string;
  marketData?: Pick<
    MiniMarketData,
    'market_cap' | 'market_cap_category'
  > | null;
  singleLine?: boolean;
}) {
  const singleLine =
    _singleLine || typeof marketData?.market_cap_category !== 'string';
  return (
    <span
      className={clsx(
        'inline-flex flex-col gap-px',
        singleLine && 'text-2xs [&_svg]:size-3',
        className,
      )}
    >
      {!singleLine && (
        <span className="text-sm text-v1-content-secondary">
          {marketData?.market_cap_category ?? '-'}
        </span>
      )}
      <div
        className={clsx(
          !singleLine && 'text-xs',
          'flex items-center gap-1 font-medium',
        )}
      >
        <CapIcon />
        <ReadableNumber
          format={
            singleLine
              ? {
                  compactInteger: true,
                  decimalLength: 1,
                  separateByComma: true,
                }
              : undefined
          }
          label="$"
          popup="never"
          value={marketData?.market_cap}
        />
      </div>
    </span>
  );
}
