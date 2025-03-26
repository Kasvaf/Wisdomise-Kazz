import { useState, type ComponentProps, type FC } from 'react';
import { clsx } from 'clsx';
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
    start: new Date(
      Math.max(
        Date.now() - 1000 * 60 * 20,
        value?.creation_datetime
          ? new Date(value.creation_datetime).getTime()
          : 0,
      ),
    ).toISOString(),
    resolution: '1m',
    exchange: 'Raydium',
  });

  return (
    <>
      {ready && !candles.data?.length ? (
        <p className={clsx('text-xxs', props.className)}>
          {candles.data?.length === 0 ? 'Not Enough Transaction' : 'Loading...'}
        </p>
      ) : (
        <CoinMiniCandleChart
          value={candles.data ?? []}
          onReady={() => setReady(true)}
          {...props}
        />
      )}
    </>
  );
};
