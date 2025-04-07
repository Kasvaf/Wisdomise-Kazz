import { type Candle, type Resolution } from 'api';
import { type MarketTypes } from 'api/types/shared';
import { ofetch } from 'config/ofetch';

const caches: Record<string, Candle[]> = {};

const durs: Record<Resolution, number> = {
  '1m': 1000 * 60,
  '5m': 1000 * 60 * 5,
  '15m': 1000 * 60 * 15,
  '30m': 1000 * 60 * 30,
  '1h': 1000 * 60 * 60,
  '4h': 1000 * 60 * 60 * 4,
  '1d': 1000 * 60 * 60 * 24,
};

const roundDate = (dateString: string | Date, resolution: Resolution) => {
  const dateMs = +new Date(dateString);
  const dur = durs[resolution];
  const roundedDate = new Date(Math.round(dateMs / dur) * dur);
  return roundedDate.toISOString();
};

const getCandlesCached = async ({
  asset,
  resolution,
  startDateTime,
  endDateTime,
  market,
}: {
  asset: string;
  resolution: Resolution;
  startDateTime: string;
  endDateTime: string;
  market: MarketTypes;
}) => {
  const startDate = roundDate(startDateTime, resolution);
  const endDate = roundDate(endDateTime, resolution);

  const cacheKey = [asset, resolution, startDate, endDate, market].join(',');

  if (caches[cacheKey]) return caches[cacheKey];

  const data = await ofetch<Candle[]>('/delphi/candles', {
    query: {
      asset,
      resolution,
      start_datetime: startDate,
      end_datetime: endDate,
      market_type: market,
    },
  });

  caches[cacheKey] = data;
  return data;
};

export default getCandlesCached;
