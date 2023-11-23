import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ORIGIN } from 'config/constants';
import { type SignalsResponse } from '../types/signalResponse';
import { type MarketTypes } from '../types/financialProduct';

export const useSignalsQuery = () =>
  useQuery(['signals'], async () => {
    const { data } = await axios.get<SignalsResponse>(
      `${API_ORIGIN}/api/v0/strategy/last-positions`,
    );
    return data;
  });

export type Resolution = '1m' | '3m' | '5m' | '15m' | '30m' | '1h';

interface StrategyListItem {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  symbols: string[];
  has_active_entangled_fpi: boolean;
  open_positions: number;
  last_week_positions: number;
}

export interface Asset {
  display_name: string;
  name: string;
  symbol: string;
}

export interface StrategyAsset {
  share: number;
  asset: Asset;
}

export interface StrategyData {
  key: string;
  is_active: boolean;
  has_active_entangled_fpi?: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  strategy_id: string;
  secret_key: string;
  assets: StrategyAsset[];
  resolution: Resolution;
}

export const useMyStrategiesQuery = () =>
  useQuery(
    ['strategies'],
    async () => {
      const { data } = await axios.get<StrategyListItem[]>(
        '/strategy/strategies',
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useStrategyQuery = (strategyKey?: string) =>
  useQuery(
    ['strategy', strategyKey],
    async () => {
      if (!strategyKey) throw new Error('unexpected');
      const { data } = await axios.get<StrategyData>(
        `strategy/strategies/${strategyKey}`,
      );
      return data;
    },
    {
      enabled: strategyKey != null,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useCreateStrategyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    StrategyData,
    unknown,
    {
      name: string;
      market_name: MarketTypes;
      tags: string[];
      resolution: Resolution;
    }
  >(
    async body => {
      const { data } = await axios.post<StrategyData>(
        '/strategy/strategies',
        body,
      );
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['strategies']);
      },
    },
  );
};

export const useUpdateStrategyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    StrategyData,
    unknown,
    {
      key: string;
      name: string;
      tags: string[];
      assets: StrategyAsset[];
      resolution: Resolution;
    }
  >(async ({ key, ...params }) => {
    const { data } = await axios.patch<StrategyData>(
      `/strategy/strategies/${key}`,
      params,
    );
    await queryClient.invalidateQueries(['strategies']);
    await queryClient.invalidateQueries(['strategy', key]);
    return data;
  });
};

// ========================================================================

export const useAllowedAssetsQuery = (strategyKey?: string) =>
  useQuery(
    ['allowedAssets', strategyKey],
    async () => {
      if (!strategyKey) throw new Error('unexpected');
      const { data } = await axios.get<{ assets: Asset[] }>(
        `/strategy/strategies/${strategyKey}/allowed_assets`,
      );
      return data.assets;
    },
    {
      enabled: strategyKey != null,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
