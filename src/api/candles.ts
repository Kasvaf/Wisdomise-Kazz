import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export type Resolution = '1m' | '3m' | '5m' | '15m' | '30m' | '1h';

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
}: {
  asset?: string;
  resolution?: Resolution;
  startDateTime?: string | Date;
  endDateTime?: string | Date;
}) =>
  useQuery(
    ['candles', asset, resolution, startDateTime, endDateTime],
    async () => {
      const { data } = await axios.get<Candle[]>('/delphi/candles', {
        params: {
          asset,
          resolution,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
        },
      });
      return data;
    },
    {
      enabled: Boolean(asset && resolution && startDateTime && endDateTime),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useRecentCandlesQuery = (asset: string | undefined) =>
  useCandlesQuery({
    asset,
    resolution: '1h',
    startDateTime: useMemo(() => {
      const startDateTime = new Date();
      startDateTime.setMonth(startDateTime.getMonth() - 3);
      return startDateTime.toISOString();
    }, []),
    endDateTime: useMemo(() => new Date().toISOString(), []),
  });
