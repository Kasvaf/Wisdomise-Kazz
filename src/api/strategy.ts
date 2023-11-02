import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ORIGIN } from 'config/constants';
import { type SignalsResponse } from './types/signalResponse';
import { type MarketTypes } from './types/financialProduct';
import { type FpiPosition } from './types/investorAssetStructure';

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

interface StrategyHistory {
  ket: string;
  active_positions: FpiPosition[];
  historical_positions: FpiPosition[];
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

// ========================================================================

export const useCreateStrategyEntangledFPI = () => {
  const queryClient = useQueryClient();
  return useMutation<
    StrategyHistory,
    unknown,
    { strategyKey: string; externalAccount?: string }
  >(async ({ strategyKey, externalAccount }) => {
    const { data } = await axios.post<StrategyHistory>(
      `strategy/strategies/${strategyKey}/create_entangled_fpi`,
      externalAccount && { external_account: externalAccount },
    );
    await queryClient.invalidateQueries(['strategies']);
    await queryClient.invalidateQueries(['strategy', strategyKey]);
    return data;
  });
};

const useStrategyHistoryFullQuery = (strategyKey?: string) =>
  useQuery(
    ['strategyHistoryFull', strategyKey],
    async () => {
      if (!strategyKey) throw new Error('unexpected');
      const { data } = await axios.get<StrategyHistory>(
        `/strategy/strategies/${strategyKey}/entangled_fpi`,
      );
      return data;
    },
    { enabled: strategyKey != null },
  );

export const useStrategyHistoryQuery = ({
  strategyKey,
  start_datatime: start,
  end_datetime: end,
  offset,
  limit,
}: {
  strategyKey?: string;
  start_datatime?: string;
  end_datetime?: string;
  offset?: number;
  limit?: number;
}) => {
  const fullHistory = useStrategyHistoryFullQuery(strategyKey);
  return useQuery<{ position_history: FpiPosition[]; total: number }>(
    ['strategyHistory', fullHistory, strategyKey, start, end, offset, limit],
    async () => {
      const h = fullHistory.data?.historical_positions;
      if (!strategyKey || !h) throw new Error('unexpected');

      if (offset != null && limit != null) {
        return {
          total: h.length,
          position_history: h.slice(offset, offset + limit),
        };
      }

      if (start != null && end != null) {
        return {
          total: h.length,
          position_history: h.filter(
            x =>
              (!x.exit_time || +new Date(x.exit_time) > +new Date(start)) &&
              +new Date(x.entry_time) < +new Date(end),
          ),
        };
      }

      throw new Error('unexpected');
    },
    {
      keepPreviousData: true,
      enabled:
        strategyKey != null &&
        fullHistory.data != null &&
        ((start != null && end != null) || (offset != null && limit != null)),
    },
  );
};
