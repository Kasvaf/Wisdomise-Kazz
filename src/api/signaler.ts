import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type Quote } from './types/investorAssetStructure';
import { type TheoreticalPosition } from './strategy';
import { type SuggestedAction } from './types/signalResponse';

const isPublic = 'is_public=True';

export interface SignalerPair {
  base: Quote;
  quote: Quote;
  name: string;
  display_name: string;
}

export const useSignalerPairs = () =>
  useQuery<SignalerPair[]>(
    ['signaler-pairs'],
    async () => {
      const { data } = await axios.get<SignalerPair[]>('strategy/pairs');
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

export interface PairSignalerItem extends TheoreticalPosition {
  pair_name: string;
  strategy: Strategy;
  pnl_equity: number;
  stop_loss: number;
  take_profit: number;
  suggested_action: SuggestedAction;
  leverage: number;
}

export interface Strategy {
  key: string;
  name: string;
  version: string;
  resolution: string;
  market_name: string;
  profile?: Profile;
}

interface Profile {
  title: string;
  description: string;
  position_sides: string[];
  subscription_level?: number;
}

function strategyComparer(a: Strategy, b: Strategy) {
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
        `strategy/positions?pair_base=${base}&pair_quote=${quote}&last=True&${isPublic}`,
      );
      return data.sort((a, b) => strategyComparer(a.strategy, b.strategy));
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
};

export interface StrategyItem {
  key: string;
  name: string;
  version: string;
  resolution: string;
  market_name: string;
  config?: any;
  profile?: Profile;
  supported_pairs: SignalerPair[];
}

export const useStrategiesList = () => {
  return useQuery<StrategyItem[]>(
    ['signaler-strategies'],
    async () => {
      const { data } = await axios.get<StrategyItem[]>(
        'strategy/strategies?' + isPublic,
      );
      return data.sort(strategyComparer);
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
        `strategy/positions?pair_base=${base}&pair_quote=${quote}&strategy_key=${key}&${isPublic}`,
      );
      return data;
    },
    {
      enabled: Boolean(key && base && quote),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
};
