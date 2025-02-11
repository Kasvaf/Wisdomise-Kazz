import { useEffect, type FC } from 'react';
import { clsx } from 'clsx';
import { Trans } from 'react-i18next';
import { useCoinDetails } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import { ReactComponent as PriceIcon } from './price.svg';

export const CoinPriceInfo: FC<{
  slug: string;
  loading?: boolean;
  className?: string;
  onCurrentPriceChange?: (currentPrice: number) => void;
}> = ({ slug, loading, className, onCurrentPriceChange }) => {
  const coinOverview = useCoinDetails({
    slug,
  });

  useEffect(() => {
    if (typeof coinOverview.data?.data?.current_price === 'number') {
      onCurrentPriceChange?.(coinOverview.data?.data?.current_price);
    }
  }, [coinOverview.data?.data?.current_price, onCurrentPriceChange]);

  return (
    <div
      className={clsx(
        'flex items-center gap-1 py-6 text-xs',
        (loading || coinOverview.isLoading) && 'animate-pulse blur-sm',
        className,
      )}
    >
      <PriceIcon />
      <Trans
        i18nKey="common.price-info"
        ns="alerts"
        components={{
          Coin: coinOverview.data?.symbol ? (
            <Coin
              coin={coinOverview.data?.symbol}
              mini
              nonLink
              className="!p-0"
              imageClassName="hidden"
            />
          ) : (
            <></>
          ),
          Price: (
            <ReadableNumber
              className="text-sky-400"
              value={coinOverview.data?.data?.current_price}
              label="usdt"
            />
          ),
        }}
      />
    </div>
  );
};
