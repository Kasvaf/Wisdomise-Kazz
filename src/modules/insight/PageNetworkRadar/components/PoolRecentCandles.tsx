import { useState, type ComponentProps, type FC } from 'react';
import { type NetworkRadarPool } from 'api/insight/network';
import { CoinMiniCandleChart } from 'shared/CoinMiniCandleChart';
import { useCandlesBySlugs } from 'api';

export const PoolRecentCandles: FC<
  Omit<ComponentProps<typeof CoinMiniCandleChart>, 'value' | 'onReady'> & {
    value?: NetworkRadarPool;
  }
> = ({ value, ...props }) => {
  const [ready, setReady] = useState(false);

  const candles = useCandlesBySlugs({
    base: ready ? value?.base_symbol.slug : undefined,
    quote: value?.quote_symbol.slug,
    start: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    resolution: '1m',
    exchange: 'Raydium',
  });

  return (
    <CoinMiniCandleChart
      value={candles.data ?? []}
      onReady={() => setReady(true)}
      {...props}
    />
  );
};
