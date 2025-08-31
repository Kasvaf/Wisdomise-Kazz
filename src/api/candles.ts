import { useQuery } from '@tanstack/react-query';
import {
  SOLANA_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
} from 'api/chains/constants';
import { ofetch } from 'config/ofetch';
import dayjs from 'dayjs';
import { useActiveNetwork } from 'modules/base/active-network';
import { useGrpc } from './grpc-v2';
import { useSupportedPairs } from './trader';
import type { MarketTypes } from './types/shared';

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

interface LastCandleParams {
  slug?: string; // slug
  quote?: string;
  network?: 'solana' | 'the-open-network';
  market?: MarketTypes;
  convertToUsd?: boolean;
  debug?: boolean;
}

export const useLastCandleQuery = ({
  network,
  slug: base,
  quote,
  market = 'SPOT',
  convertToUsd = !quote,
  debug,
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

  return useGrpc({
    service: 'delphinus',
    method: 'lastCandleStream',
    payload: {
      market,
      network: bestNet,
      baseSlug: base,
      quoteSlug: theQuote,
      convertToUsd,
    },
    enabled: Boolean(base && theQuote && bestNet && market),
    history: 0,
  });

  // return useQuery({
  //   queryKey: ['last-candle', base, theQuote, bestNet, market, convertToUsd],
  //   queryFn: async () => {
  //     const data = await ofetch<LastCandleResponse>('/delphinus/last_candle/', {
  //       query: {
  //         base,
  //         quote: theQuote,
  //         network: bestNet,
  //         market,
  //         convert_to_usd: convertToUsd,
  //         t: String(Date.now()),
  //       },
  //     });
  //     return data;
  //   },
  //   enabled: Boolean(base && theQuote && bestNet && market),
  //   staleTime: 1000,
  //   refetchInterval: 10_000,
  // });
};

export const useLastPriceQuery = (params: LastCandleParams) => {
  const { data, ...rest } = useLastCandleQuery(params);
  return {
    ...rest,
    data: data?.candle?.close ? Number(data?.candle?.close) : undefined,
  };
};

const useUSDTLastPrice = () => {
  return useLastPriceQuery({ slug: 'tether', quote: 'usd-coin' });
};

const useUSDCLastPrice = () => {
  return useLastPriceQuery({ slug: 'usd-coin', quote: 'tether' });
};

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

const useBatchCandlesQuery = (userConfig: {
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

export const useBatchLastPriceQuery = ({
  bases,
  network,
}: {
  bases?: string[];
  network: 'solana' | 'the-open-network';
}) => {
  const { data: usdtPrice, isLoading: l1 } = useUSDTLastPrice();
  const { data: usdcPrice, isLoading: l2 } = useUSDCLastPrice();

  const noneUsdBases = bases?.filter(
    base => ![USDT_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS].includes(base),
  );

  const quotes = noneUsdBases?.map(base =>
    base === SOLANA_CONTRACT_ADDRESS
      ? USDC_CONTRACT_ADDRESS
      : SOLANA_CONTRACT_ADDRESS,
  );

  const { data: batchCandles, isPending } = useBatchCandlesQuery({
    bases: noneUsdBases,
    quotes,
    network,
  });

  return {
    data: bases?.map(
      base =>
        (base === USDC_CONTRACT_ADDRESS
          ? usdcPrice
          : base === USDT_CONTRACT_ADDRESS
            ? usdtPrice
            : batchCandles?.find(res => res.symbol.base === base)?.candles?.[0]
                ?.close) ?? 0,
    ),
    isPending: l1 || l2 || isPending,
  };
};
