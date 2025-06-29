import { type DelphinusServiceClientImpl } from 'api/proto/delphinus';
import { isProduction } from 'utils/version';

export type Resolution =
  | '1s'
  | '5s'
  | '15s'
  | '30s'
  | '1m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '4h';

interface ChartCandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number;
}

const caches: Record<string, Promise<ChartCandle[]> | undefined> = {};
const getCandlesCached = async (
  delphinus: DelphinusServiceClientImpl,
  params: {
    network: string;
    baseSlug: string;
    quoteSlug: string;
    resolution: Resolution;
    startTime: string;
    endTime: string;
    skipEmptyCandles: boolean;
    market: string;
  },
) => {
  const cacheKey = JSON.stringify(params);
  if (!caches[cacheKey]) {
    caches[cacheKey] = delphinus
      .getCandles(params)
      .then(data =>
        data.candles.map(c => ({
          open: +c.open,
          high: +c.high,
          low: +c.low,
          close: +c.close,
          volume: +c.volume,
          time: +new Date(c.relatedAt),
        })),
      )
      .catch(error => {
        if (!isProduction) {
          console.error(error);
        }
        caches[cacheKey] = undefined;
        throw error;
      });
  }
  return await caches[cacheKey];
};

export default getCandlesCached;
