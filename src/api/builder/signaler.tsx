import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type MarketTypes } from 'api/types/financialProduct';
import { type PairData } from 'api/types/strategy';
import { type Resolution } from 'api';
import normalizePair from 'api/normalizePair';

interface SignalerListItem {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  assets: PairData[];
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
      return data.map(s => ({
        ...s,
        assets: s.assets.map(normalizePair),
      })) as SignalerListItem[];
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
      data.assets = data.assets
        .map(normalizePair)
        .sort((a, b) => a.name.localeCompare(b.name));
      return data;
    },
    {
      enabled: !!signaler,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

// ======================================================================

export interface SignalerData {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  strategy_id: string;
  secret_key: string;
  signal_api_call_example: string;
  assets: PairData[];
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
      resolution: Resolution;
    }
  >(
    async body => {
      const { data } = await axios.post<SignalerData>('/factory/strategies', {
        is_active: true,
        ...body,
      });
      data.assets = data.assets.map(normalizePair);
      return data;
    },
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['signalers'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['fp-catalog'],
          }),
        ]);
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
      assets: Array<{ name: string }>;
      resolution: Resolution;
    }
  >(async ({ key, ...params }) => {
    const { data } = await axios.patch<SignalerData>(
      `/factory/strategies/${key}`,
      { is_active: true, ...params },
    );

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['signalers'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['signaler', key],
      }),
      queryClient.invalidateQueries({
        queryKey: ['fp-catalog'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['fp', key],
      }),
    ]);
    return data;
  });
};

export const useDeleteSignalerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(async ({ key }: { key: string }) => {
    await axios.delete(`/factory/strategies/${key}`);
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['signalers'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['fp-catalog'],
      }),
    ]);
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
