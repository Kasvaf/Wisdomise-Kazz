import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type MarketTypes } from 'api/types/financialProduct';
import { type Resolution } from 'api';

interface SignalerListItem {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  symbols: string[];
  open_positions: number;
  last_week_positions: number;
}

export const useMySignalersQuery = () =>
  useQuery(
    ['signalers'],
    async () => {
      const { data } = await axios.get<SignalerListItem[]>(
        '/factory/strategies',
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

// ======================================================================

export const useSignalerQuery = (signaler?: string) =>
  useQuery(
    ['signaler', signaler],
    async () => {
      if (!signaler) throw new Error('unexpected');
      const { data } = await axios.get<SignalerData>(
        `factory/strategies/${signaler}`,
      );
      return data;
    },
    {
      enabled: !!signaler,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

// ======================================================================

export interface Asset {
  display_name: string;
  name: string;
  symbol: string;
}

export interface SignalerData {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  strategy_id: string;
  secret_key: string;
  signal_api_call_example: string;
  assets: Asset[];
  resolution: Resolution;
}

export const useCreateSignalerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SignalerData,
    unknown,
    {
      name: string;
      market_name: MarketTypes;
      tags: string[];
      resolution: Resolution;
    }
  >(
    async body => {
      const { data } = await axios.post<SignalerData>('/factory/strategies', {
        is_active: true,
        ...body,
      });
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['signalers']);
      },
    },
  );
};

export const useUpdateSignalerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SignalerData,
    unknown,
    {
      key: string;
      name: string;
      tags: string[];
      assets: Asset[];
      resolution: Resolution;
    }
  >(async ({ key, ...params }) => {
    const { data } = await axios.patch<SignalerData>(
      `/factory/strategies/${key}`,
      { is_active: true, ...params },
    );
    await queryClient.invalidateQueries(['signalers']);
    await queryClient.invalidateQueries(['signaler', key]);
    return data;
  });
};

// ======================================================================

interface PerfData {
  positions: number;
  pnl: number;
  max_drawdown: number;
  pnl_timeseries: Array<{
    d: string;
    v: number;
  }>;
}

export const useSignalerPerfQuery = ({
  signalerKey,
  assetName,
  startTime,
  endTime,
}: {
  signalerKey?: string;
  assetName?: string;
  startTime?: string;
  endTime?: string;
}) =>
  useQuery(
    ['signalerPerf', signalerKey, assetName, startTime, endTime],
    async () => {
      if (!signalerKey) throw new Error('unexpected');
      const { data } = await axios.get<PerfData>(
        `/factory/strategies/${signalerKey}/performance`,
        {
          params: {
            asset_name: assetName,
            start_time: startTime,
            end_time: endTime,
          },
        },
      );
      return data;
    },
    {
      enabled: !!signalerKey && !!assetName && !!startTime && !!endTime,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
