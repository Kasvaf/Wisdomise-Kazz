import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ofetch } from 'config/ofetch';
import { useActiveNetwork } from 'modules/base/active-network';
import { type MarketTypes } from './types/shared';
import { useSupportedPairs } from './trader';

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
  useQuery({
    queryKey: [
      'candles',
      asset,
      resolution,
      startDateTime,
      endDateTime,
      market,
    ],
    queryFn: async () => {
      const data = await ofetch<Candle[]>('/delphi/candles', {
        query: {
          asset,
          resolution,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          market_type: market,
        },
      });
      return data;
    },
    enabled: Boolean(
      asset &&
        resolution &&
        startDateTime &&
        endDateTime &&
        market !== undefined,
    ),
    staleTime: Number.POSITIVE_INFINITY,
  });

interface LastCandleResponse {
  symbol: {
    id: number;
    name: string;
    exchange: string;
    market: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: null;
    pool_address: null;
    base: string;
    quote: string;
  };
  candle: Candle;
}

interface LastCandleParams {
  slug?: string; // slug
  quote?: string;
  network?: 'solana' | 'the-open-network';
  market?: MarketTypes;
  convertToUsd?: boolean;
}

export const useLastCandleQuery = ({
  network,
  slug: base,
  quote,
  market = 'SPOT',
  convertToUsd = !quote,
}: LastCandleParams) => {
  const { data: supportedPairs } = useSupportedPairs(base);

  // list of all quote+networks for this base-slug
  const netPairs = supportedPairs?.flatMap(sp =>
    sp.network_slugs.map(net => ({
      quote: sp.quote.slug,
      net,
    })),
  );

  // first pair that matches both quote and active-network
  const activeNet = useActiveNetwork();
  const net = network || activeNet;

  const bestPair =
    netPairs?.find(
      x => (!quote || x.quote === quote) && (!net || x.net === net),
    ) ||
    // first pair that matches a quote, with a well-known exchange (net is not active)
    netPairs?.find(
      x =>
        (!quote || x.quote === quote) &&
        (x.net === 'the-open-network' || x.net === 'solana'),
    ) ||
    netPairs?.[0];

  const theQuote = bestPair?.quote;
  const bestNet = network || bestPair?.net;

  return useQuery({
    queryKey: ['last-candle', base, theQuote, bestNet, market, convertToUsd],
    queryFn: async () => {
      const data = await ofetch<LastCandleResponse>('/delphinus/last_candle/', {
        query: {
          base,
          quote: theQuote,
          network_slug: bestNet,
          market,
          convert_to_usd: convertToUsd,
          t: String(Date.now()),
        },
      });
      return data;
    },
    enabled: Boolean(base && theQuote && bestNet && market),
    staleTime: 1000,
    refetchInterval: 10_000,
  });
};

export const useLastPriceQuery = (params: LastCandleParams) => {
  const { data, ...rest } = useLastCandleQuery(params);
  return {
    ...rest,
    data: data?.candle.close,
  };
};

export const useCandlesBySlugs = (userConfig: {
  base?: string;
  quote?: string;
  network: 'the-open-network' | 'solana';
  resolution?: Resolution;
  start?: string;
  end?: string;
  skip_empty_candles?: boolean;
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
  const queryKey = [
    'candles-by-slugs',
    ...Object.entries(config).filter(([k]) => k !== 'start' && k !== 'end'),
    dayjs(config.start).format('YYYY-MM-DD HH:mm'),
    dayjs(config.end).format('YYYY-MM-DD HH:mm'),
  ];

  return useQuery({
    queryKey,
    queryFn: () => {
      return ofetch<{ candles: Candle[] }>('delphinus/candles-by-slugs/', {
        query: {
          market: 'SPOT',
          ...config,
        },
        meta: { auth: false },
      }).then(resp => resp.candles);
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!config.base && !!config.quote,
    placeholderData: p => p,
  });
};
