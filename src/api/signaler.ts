import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { useMainQuote } from './ias/investor-asset-structures';
import { type MarketTypes } from './types/financialProduct';
import { type RawPosition, type SuggestedAction } from './types/signalResponse';
import { type PairDataFull, type PairData } from './types/strategy';
import { type CommunityProfile } from './account';
import { type SignalItem } from './builder';
import normalizePair from './normalizePair';

export const useSignalerPairs = () =>
  useQuery<PairDataFull[]>(
    ['signaler-pairs'],
    async () => {
      const { data } = await axios.get<PairDataFull[]>('catalog/pairs');
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useSignalerPairByNames = () => {
  const { data: pairs } = useSignalerPairs();
  return useMemo(
    () => Object.fromEntries(pairs?.map(x => [x.base.name, x]) ?? []),
    [pairs],
  );
};

export const useSignalerPair = (market: MarketTypes) => {
  const mainQuote = useMainQuote() || 'USDT';
  const pairsByName = useSignalerPairByNames();

  return (searchName?: string): PairDataFull | undefined => {
    if (!searchName) return;
    searchName = searchName.toUpperCase();
    const match = searchName.match(/\/?(BUSD|USDT)$/);
    const base = searchName.replace(/\/?(BUSD|USDT)$/, '');
    const quote = match?.[1] || mainQuote;
    const pair = pairsByName[base + quote];
    const name = market === 'FUTURES' ? base + quote : base;
    return pair
      ? { ...pair, name }
      : {
          name,
          display_name: base,
          base: { name: base },
          quote: { name: quote },
          time_window_pnl: 0,
          time_window_prices: [],
        };
  };
};

export const useIsSamePairs = () => {
  const pairByName = useSignalerPair('SPOT');
  return (p1: string, p2: string) =>
    pairByName(p1)?.base.name === pairByName(p2)?.base.name;
};

export interface PairDetails {
  id: number;
  name: string;
  base: string;
  quote: string;
  price_data: {
    last_price: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    volume_24h: number;
    market_cap?: number;
  };
}

export const useSignalerPairDetails = (name: string) =>
  useQuery<PairDetails>(
    ['signaler-pairs', name],
    async () => {
      const { data } = await axios.get<PairDetails>('catalog/pairs/' + name);
      return data;
    },
    {
      enabled: !!name,
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 30 * 1000,
      refetchIntervalInBackground: true,
    },
  );

export interface PairSignalerItem extends RawPosition {
  pair_name: string;
  strategy: ThinStrategy;
  pnl_equity: number;
  stop_loss?: number | null;
  take_profit?: number | null;
  suggested_action: SuggestedAction;
  leverage: number;
  manager?: {
    stop_loss?: SignalItem[];
    take_profit?: SignalItem[];
  };
}

export interface ThinStrategy {
  key: string;
  name: string;
  profile?: Profile;
}

interface Profile {
  'title': string;
  'description': string;
  'position_sides': string[];
  'subscription_level'?: number;
  'SL/TP'?: string;
  'weight'?: number;
}

function strategyComparer(a: ThinStrategy, b: ThinStrategy) {
  const subDiff =
    (a.profile?.subscription_level ?? 0) - (b.profile?.subscription_level ?? 0);
  return (
    subDiff ||
    (a.profile?.title ?? a.name).localeCompare(b.profile?.title ?? b.name)
  );
}

export const usePairSignalers = (base?: string, quote?: string) => {
  return useQuery<PairSignalerItem[]>(
    ['pair-signaler', base, quote],
    async () => {
      if (!base || !quote) return [];
      const { data } = await axios.get<PairSignalerItem[]>(
        `catalog/positions?pair_base=${base}&pair_quote=${quote}&last=True`,
      );
      return data.sort((a, b) => strategyComparer(a.strategy, b.strategy));
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
};

export const useStrategyPositions = (
  key?: string,
  base?: string,
  quote?: string,
) => {
  return useQuery<PairSignalerItem[]>(
    ['signaler-positions', key, base, quote],
    async () => {
      if (!(key && base && quote)) return [];
      const { data } = await axios.get<PairSignalerItem[]>(
        `catalog/positions?pair_base=${base}&pair_quote=${quote}&strategy_key=${key}`,
      );
      return data;
    },
    {
      enabled: Boolean(key && base && quote),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
};

export const useBestPerformingQuery = ({
  days,
  limit,
}: {
  days: number;
  limit: number;
}) => {
  return useQuery<PairSignalerItem[]>(
    ['best-positions', days],
    async () => {
      // dates rounded to 10 minutes intervals!
      const rndInt = 1000 * 60 * 10;
      const now = Math.round(Date.now() / rndInt) * rndInt;
      const endDate = new Date(now);
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - days);
      const { data } = await axios.get<PairSignalerItem[]>(
        `catalog/positions?order_by=-pnl&start=${startDate.toISOString()}&end=${endDate.toISOString()}&limit=${limit}`,
      );
      return data;
    },
    {
      enabled: Boolean(days && limit),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
};

export interface StrategyItem {
  key: string;
  name: string;
  version: string;
  resolution: string;
  market_name: MarketTypes;
  config?: any;
  profile?: Profile;
  supported_pairs: PairData[];
}

export const useStrategiesList = () => {
  return useQuery<StrategyItem[]>(
    ['signaler-strategies'],
    async () => {
      const { data } = await axios.get<StrategyItem[]>('catalog/strategies');
      return data
        .map(s => ({
          ...s,
          supported_pairs: s.supported_pairs.map(normalizePair),
        }))
        .sort(strategyComparer);
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
};

export const useSignalsQuery = () =>
  useQuery(['signals'], async () => {
    const { data } = await axios.get<PairSignalerItem[]>(
      'catalog/positions?thin=True&last=True',
    );
    return data.sort((a, b) => strategyComparer(a.strategy, b.strategy));
  });

export type StrategiesPerformanceBulkResolution = 'MONTH3' | 'MONTH' | 'WEEK';

interface StrategyPerformanceBulkBase {
  name: string;
  strategy_key: string;
  owner: {
    key: string;
    cprofile: CommunityProfile;
  };
}

interface StrategyPerformanceBulkInfo {
  pair: {
    display_name: string;
    name: string;
    base: {
      name: string;
    };
    quote: {
      name: string;
    };
  };
  positions: number;
  pnl: number;
  max_drawdown: number;
  pnl_timeseries: Array<{
    d: string;
    v: number;
  }>;
}

export type StrategyPerformanceBulkUngrouped = StrategyPerformanceBulkBase &
  StrategyPerformanceBulkInfo;

export type StrategyPerformanceBulkGrouped = StrategyPerformanceBulkBase & {
  pairs_performance: StrategyPerformanceBulkInfo[];
};

export const useStrategiesPerformanceBulk = <G extends boolean>(filters: {
  resolution: StrategiesPerformanceBulkResolution;
  groupByStrategy: G;
  userId?: string;
}) =>
  useQuery(
    [
      'strategies/performance_bulk',
      `strategies/performance_bulk?${JSON.stringify(filters)}`,
    ],
    async () => {
      const { data } = await axios.get<
        G extends true
          ? StrategyPerformanceBulkGrouped[]
          : StrategyPerformanceBulkUngrouped[]
      >(
        `factory/strategies/performance_bulk?resolution=${filters.resolution}${
          filters.groupByStrategy ? '&group_by_strategy=true' : ''
        }${filters.userId ? `&user_id=${filters.userId}` : ''}`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
