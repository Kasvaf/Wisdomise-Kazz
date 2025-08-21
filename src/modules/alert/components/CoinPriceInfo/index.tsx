import { useCoinDetails } from 'api/discovery';
import { clsx } from 'clsx';
import { type FC, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
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
        components={{
          Coin: coinOverview.data?.symbol ? (
            <Coin
              className="!p-0"
              coin={coinOverview.data?.symbol}
              imageClassName="hidden"
              mini
              nonLink
            />
          ) : (
            <></>
          ),
          Price: (
            <ReadableNumber
              className="text-sky-400"
              label="usdt"
              value={coinOverview.data?.data?.current_price}
            />
          ),
        }}
        i18nKey="common.price-info"
        ns="alerts"
      />
    </div>
  );
};
