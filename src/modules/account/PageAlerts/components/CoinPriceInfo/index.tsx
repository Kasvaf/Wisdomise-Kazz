import { type FC } from 'react';
import { clsx } from 'clsx';
import { Trans } from 'react-i18next';
import { useCoinOverview } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import { ReactComponent as PriceIcon } from './price.svg';

export const CoinPriceInfo: FC<{
  slug: string;
  loading?: boolean;
  className?: string;
}> = ({ slug, loading, className }) => {
  const { data: coinInfo } = useCoinOverview({
    slug,
  });
  if (!coinInfo?.symbol) return null;
  return (
    <div
      className={clsx(
        'flex items-center gap-1 py-6 text-xs',
        loading ? 'animate-pulse blur-sm' : !coinInfo && 'hidden',
        className,
      )}
    >
      <PriceIcon />
      <Trans
        i18nKey="common.price-info"
        ns="alerts"
        components={{
          Coin: <Coin coin={coinInfo?.symbol} mini imageClassName="hidden" />,
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
