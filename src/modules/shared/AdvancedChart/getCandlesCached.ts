import { type Candle } from 'api';
import { ofetch } from 'config/ofetch';

const caches: Record<string, Candle[]> = {};

export type Resolution = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
export const durs: Record<Resolution, number> = {
  '1m': 60,
  '5m': 60 * 5,
  '15m': 60 * 15,
  // '30m': 60,
  '1h': 60 * 60,
  '4h': 60 * 60 * 4,
  // '12h': 60 * 60 * 12,
  '1d': 60 * 60 * 24,
};

const durConf: Record<Resolution, [string, number]> = {
  '1m': ['minute', 1],
  '5m': ['minute', 5],
  '15m': ['minute', 15],
  // '30m': 60,
  '1h': ['hour', 1],
  '4h': ['hour', 4],
  // '12h': 60 * 60 * 12,
  '1d': ['day', 1],
};

const getCandlesCached = async ({
  network,
  pool,
  token,
  resolution,
  startDateTime,
  endDateTime,
}: {
  network: string;
  pool: string;
  token: string;
  resolution: Resolution;
  startDateTime: number;
  endDateTime: number;
}) => {
  const dur = durs[resolution];
  const before = Math.round(endDateTime / dur) * dur;
  const limit = before / dur - Math.round(startDateTime / dur);

  const cacheKey = [pool, token, resolution, limit, before].join(',');
  if (caches[cacheKey]) return caches[cacheKey];

  const normNet = network === 'the-open-network' ? 'ton' : network;
  const data = await ofetch<{
    data: {
      attributes: {
        ohlcv_list: Array<[number, number, number, number, number, number]>;
      };
    };
  }>(
    `/delphi/chart/${normNet}/pools/${pool}/ohlcv/${durConf[resolution][0]}/`,
    {
      query: {
        aggregate: durConf[resolution][1],
        token,
        before_timestamp: before,
        limit,
      },
    },
  );

  caches[cacheKey] = data.data.attributes.ohlcv_list.map<Candle>(
    ([date, open, high, low, close, volume]) => ({
      open,
      high,
      low,
      close,
      volume,
      related_at: new Date(date * 1000).toISOString(),
    }),
  );

  return caches[cacheKey];
};

export default getCandlesCached;
