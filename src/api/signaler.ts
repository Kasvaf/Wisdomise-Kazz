import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type MarketTypes } from './types/financialProduct';
import {
  type RawPosition,
  type SignalsResponse,
  type SuggestedAction,
} from './types/signalResponse';
import { type PairDataFull, type PairData } from './types/strategy';
import normalizePair from './normalizePair';

export const useSignalerPairs = () =>
  useQuery<PairDataFull[]>(
    ['signaler-pairs'],
    async () => {
      const { data } = await axios.get<PairDataFull[]>('strategy/pairs');
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

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
      const { data } = await axios.get<PairDetails>('strategy/pairs/' + name);
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: !!name,
    },
  );

export interface PairSignalerItem extends RawPosition {
  pair_name: string;
  strategy: ThinStrategy;
  pnl_equity: number;
  stop_loss: number;
  take_profit: number;
  suggested_action: SuggestedAction;
  leverage: number;
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
        `strategy/positions?pair_base=${base}&pair_quote=${quote}&last=True`,
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
        `strategy/positions?pair_base=${base}&pair_quote=${quote}&strategy_key=${key}`,
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
        `strategy/positions?order_by=-pnl&start=${startDate.toISOString()}&end=${endDate.toISOString()}&limit=${limit}`,
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
      const { data } = await axios.get<StrategyItem[]>('strategy/strategies');
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
    const { data } = await axios.get<SignalsResponse>(
      'strategy/last-positions',
    );
    return data;
  });
