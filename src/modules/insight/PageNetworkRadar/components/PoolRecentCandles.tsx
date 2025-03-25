import { type ComponentProps, type FC } from 'react';
import { type NetworkRadarPool } from 'api/insight/network';
import { CoinMiniCandleChart } from 'shared/CoinMiniCandleChart';
import { useCandlesBySlugs } from 'api';

export const PoolRecentCandles: FC<
  Omit<ComponentProps<typeof CoinMiniCandleChart>, 'value'> & {
    value?: NetworkRadarPool;
  }
> = ({ value, ...props }) => {
  const candles = useCandlesBySlugs({
    base: value?.base_symbol.slug,
    quote: value?.quote_symbol.slug,
    start: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    resolution: '1m',
    exchange: 'Raydium',
  });

  return <CoinMiniCandleChart value={candles.data ?? []} {...props} />;
};
