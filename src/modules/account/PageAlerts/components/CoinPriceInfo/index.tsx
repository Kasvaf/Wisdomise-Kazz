import { useEffect, type FC } from 'react';
import { clsx } from 'clsx';
import { Trans } from 'react-i18next';
import { type CoinOverview, useCoinOverview } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import { ReactComponent as PriceIcon } from './price.svg';

export const CoinPriceInfo: FC<{
  slug: string;
  loading?: boolean;
  className?: string;
  onLoad?: (coin: CoinOverview) => void;
}> = ({ slug, loading, className, onLoad }) => {
  const { data: coinInfo } = useCoinOverview({
    slug,
  });
  useEffect(() => {
    if (coinInfo) {
      onLoad?.(coinInfo);
    }
  }, [coinInfo, onLoad]);

  return (
    <div
      className={clsx(
        'flex items-center gap-1 py-6 text-xs',
        loading || (!coinInfo && 'animate-pulse blur-sm'),
        className,
      )}
    >
      <PriceIcon />
      <Trans
        i18nKey="common.price-info"
        ns="alerts"
        components={{
          Coin: coinInfo?.symbol ? (
            <Coin
              coin={coinInfo?.symbol}
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
              value={coinInfo?.data?.current_price}
              label="usdt"
            />
          ),
        }}
      />
    </div>
  );
};
