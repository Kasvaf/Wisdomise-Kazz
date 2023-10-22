import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ORIGIN } from 'config/constants';
import { type SignalsResponse } from './types/signalResponse';
import { type MarketTypes } from './types/financialProduct';

export const useSignalsQuery = () =>
  useQuery(['signals'], async () => {
    const { data } = await axios.get<SignalsResponse>(
      `${API_ORIGIN}/api/v0/strategy/last-positions`,
    );
    return data;
  });

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

export const useStrategiesQuery = () =>
  useQuery(['strategies'], async () => {
    const { data } = await axios.get<{ results: StrategyListItem[] }>(
      '/strategy/strategies',
    );
    return data;
  });

interface StrategyData {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  strategy_id: string;
  secret_key: string;
}

export const useCreateStrategyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    StrategyData,
    unknown,
    { name: string; market_name: MarketTypes; tags: string[] }
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
