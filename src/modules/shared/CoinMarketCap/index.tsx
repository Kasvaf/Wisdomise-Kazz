import { clsx } from 'clsx';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type MiniMarketData } from 'api/discovery';
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
        singleLine && 'text-xxs [&_svg]:size-3',
        className,
      )}
    >
      {!singleLine && (
        <span className="text-sm text-v1-content-primary">
          {marketData?.market_cap_category ?? '-'}
        </span>
      )}
      <div
        className={clsx(
          !singleLine && 'text-xs text-v1-content-secondary',
          'flex items-center gap-1',
        )}
      >
        <CapIcon />
        <ReadableNumber
          value={marketData?.market_cap}
          label="$"
          popup="never"
          format={
            singleLine
              ? {
                  compactInteger: true,
                  decimalLength: 1,
                  separateByComma: true,
                }
              : undefined
          }
        />
      </div>
    </span>
  );
}
