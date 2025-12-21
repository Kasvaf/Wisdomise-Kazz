import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import dayjs from 'dayjs';

export type Resolution = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';
export interface Candle {
  related_at: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  number_of_trades?: number;
  candle_count?: number;
  resolution?: Resolution;
}

export const useCandlesQuery = ({
  pairName,
  resolution,
  startDateTime = new Date(Date.now() - 1_000_000).toISOString(),
  endDateTime = new Date().toISOString(),
  marketName,
}: {
  pairName?: string;
  resolution?: Resolution;
  startDateTime?: string | Date;
  endDateTime?: string | Date;
  marketName?: string;
}) =>
  useQuery({
    queryKey: [
      'candles',
      pairName,
      resolution,
      startDateTime,
      endDateTime,
      marketName,
    ],
    queryFn: async () => {
      const data = await ofetch<Candle[]>('/delphi/candles', {
        query: {
          pair_name: pairName,
          resolution,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          market_name: marketName,
        },
      });
      return data;
    },
    enabled: Boolean(
      pairName &&
        resolution &&
        startDateTime &&
        endDateTime &&
        marketName !== undefined,
    ),
    staleTime: Number.POSITIVE_INFINITY,
  });

interface LastCandleSymbol {
  id: number;
  name: string;
  exchange: string;
  market: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  network?: string;
  pool_address: string | null;
  base: string;
  quote: string;
}

const enrichCandleConfig = (userConfig: {
  base?: string;
  quote?: string;
  network: 'the-open-network' | 'solana';
  resolution?: Resolution;
  start?: string;
  end?: string;
  skip_empty_candles?: boolean;
  bases?: string[];
  quotes?: string[];
}) => {
  const now = Date.now();
  const yesterday = now - 1000 * 60 * 60 * 24;
  const config = {
    start: new Date(yesterday).toISOString(),
    end: new Date(now).toISOString(),
    ...userConfig,
  };
  if (!config.resolution) {
    const hoursDiff = Math.abs(dayjs(config.start).diff(config.end, 'hours'));
    config.resolution =
      hoursDiff < 1
        ? '1m'
        : hoursDiff < 2
          ? '5m'
          : hoursDiff < 3
            ? '15m'
            : hoursDiff < 6
              ? '30m'
              : hoursDiff < 24
                ? '1h'
                : hoursDiff < 96
                  ? '4h'
                  : '1d';
  }
  return config;
};

export interface BatchCandleResponse {
  responses: Array<{ candles: Candle[]; symbol: LastCandleSymbol }>;
}

export const useBatchCandlesQuery = (userConfig: {
  bases?: string[];
  quotes?: string[];
  network: 'the-open-network' | 'solana';
  resolution?: Resolution;
  start?: string;
  end?: string;
}) => {
  const config = enrichCandleConfig(userConfig);
  const queryKey = [
    'candles-batch',
    ...Object.entries(config).filter(([k]) => k !== 'start' && k !== 'end'),
    dayjs(config.start).format('YYYY-MM-DD HH:mm'),
    dayjs(config.end).format('YYYY-MM-DD HH:mm'),
  ];

  return useQuery({
    queryKey,
    queryFn: () => {
      return ofetch<BatchCandleResponse>('delphinus/candles-batch/', {
        query: {
          market: 'SPOT',
          convert_to_usd: true,
          base: config.bases,
          quote: config.quotes,
          start: config.start,
          end: config.end,
          network: config.network,
          resolution: config.resolution,
        },
        meta: { auth: false },
      }).then(res => res.responses);
    },
    placeholderData: p => p,
    staleTime: Number.POSITIVE_INFINITY,
    enabled:
      (config.bases?.length ?? 0) > 0 && (config.quotes?.length ?? 0) > 0,
  });
};
