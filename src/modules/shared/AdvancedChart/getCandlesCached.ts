import { type Candle } from 'api';
import { ofetch } from 'config/ofetch';

export type Resolution = '1m' | '5m' | '15m' | '1h' | '4h' | '1D';

const durConf: Record<Resolution, [string, number]> = {
  '1m': ['minute', 1],
  '5m': ['minute', 5],
  '15m': ['minute', 15],
  // '30m': 60,
  '1h': ['hour', 1],
  '4h': ['hour', 4],
  // '12h': 60 * 60 * 12,
  '1D': ['day', 1],
};

const caches: Record<string, Promise<Candle[]>> = {};
const getCandlesCached = async ({
  network,
  pool,
  token,
  resolution,
  before,
  limit,
}: {
  network: string;
  pool: string;
  token: string;
  resolution: Resolution;
  before: number;
  limit: number;
}) => {
  const normNet = network === 'the-open-network' ? 'ton' : network;
  const cacheKey = [normNet, pool, token, resolution, before, limit].join(',');

  // don't ask for data before 180 days ago
  if (Date.now() / 1000 - before > 180 * 24 * 60 * 60) {
    return [];
  }

  if (!caches[cacheKey]) {
    caches[cacheKey] = ofetch<{
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
    ).then(data =>
      data.data.attributes.ohlcv_list.map<Candle>(
        ([date, open, high, low, close, volume]) => ({
          open,
          high,
          low,
          close,
          volume,
          related_at: new Date(date * 1000).toISOString(),
        }),
      ),
    );
  }

  return await caches[cacheKey];
};

export default getCandlesCached;
