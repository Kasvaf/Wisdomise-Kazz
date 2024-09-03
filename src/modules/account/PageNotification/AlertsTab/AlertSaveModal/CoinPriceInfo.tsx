import { type FC } from 'react';
import { clsx } from 'clsx';
import { useCoinOverview } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as PriceIcon } from './price.svg';

export const CoinPriceInfo: FC<{
  slug: string;
  loading?: boolean;
  className?: string;
}> = ({ slug, loading, className }) => {
  const { data: coinInfo } = useCoinOverview({
    slug,
  });
  return (
    <div
      className={clsx(
        'flex items-center gap-1 py-6 text-xs',
        loading ? 'animate-pulse blur-sm' : !coinInfo && 'hidden',
        className,
      )}
    >
      <PriceIcon />
      {'The price of '}
      <span className="text-sky-400">
        {coinInfo?.symbol.abbreviation.toUpperCase()}
      </span>
      {' is currently '}
      <ReadableNumber
        className="text-sky-400"
        value={coinInfo?.data?.current_price}
        label="usdt"
      />
    </div>
  );
};
