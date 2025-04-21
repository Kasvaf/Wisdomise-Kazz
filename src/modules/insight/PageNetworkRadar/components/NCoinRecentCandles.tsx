import { useState, type ComponentProps, type FC } from 'react';
import { clsx } from 'clsx';
import { type NetworkRadarNCoin } from 'api/insight/network';
import { CoinMiniCandleChart } from 'shared/CoinMiniCandleChart';
import { useCandlesBySlugs } from 'api';

export const NCoinRecentCandles: FC<
  Omit<ComponentProps<typeof CoinMiniCandleChart>, 'value' | 'onReady'> & {
    value?: NetworkRadarNCoin;
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
    skip_empty_candles: true,
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
