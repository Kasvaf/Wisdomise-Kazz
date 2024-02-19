import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type MarketTypes } from 'api/types/financialProduct';

type Resolution = '1m' | '3m' | '5m' | '15m' | '30m' | '1h';

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

export interface Asset {
  display_name: string;
  name: string;
  symbol: string;
}

export interface AssetAsset {
  share: number;
  asset: Asset;
}

interface SignalerData {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  strategy_id: string;
  secret_key: string;
  signal_api_call_example: string;
  assets: AssetAsset[];
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
      const { data } = await axios.post<SignalerData>(
        '/factory/strategies',
        body,
      );
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['signalers']);
      },
    },
  );
};
