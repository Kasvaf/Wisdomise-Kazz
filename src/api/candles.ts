import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type MarketTypes } from './types/shared';

export type Resolution = '5m' | '15m' | '30m' | '1h';
export interface Candle {
  related_at: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  number_of_trades: number;
}

export const useCandlesQuery = ({
  asset,
  resolution,
  startDateTime,
  endDateTime,
  market,
}: {
  asset?: string;
  resolution?: Resolution;
  startDateTime?: string | Date;
  endDateTime?: string | Date;
  market?: MarketTypes;
}) =>
  useQuery(
    ['candles', asset, resolution, startDateTime, endDateTime, market],
    async () => {
      const { data } = await axios.get<Candle[]>('/delphi/candles', {
        params: {
          asset,
          resolution,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          market_type: market,
        },
      });
      return data;
    },
    {
      enabled: Boolean(
        asset &&
          resolution &&
          startDateTime &&
          endDateTime &&
          market !== undefined,
      ),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export interface LastPrice {
  price: number;
  volume: number;
}
