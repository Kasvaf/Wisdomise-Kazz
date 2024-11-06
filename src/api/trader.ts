import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { type Signal } from 'api/builder';

export interface PositionsResponse {
  positions: Position[];
}

export interface Position {
  key: string;
  status: 'DRAFT' | 'PENDING' | 'OPENING' | 'OPEN' | 'CLOSED' | 'CANCELED';
  deposit_status: 'PENDING' | 'PAID' | 'EXPIRED';
  withdraw_status?: 'SENT' | 'PAID';
  pair: string;
  side: 'long' | 'short';
  signal: Signal;
  manager: unknown;
  trading_fee?: string;
  entry_price?: string;
  entry_time?: string;
  exit_price?: string;
  exit_time?: string;
  pnl?: string;
  stop_loss?: string;
  take_profit?: string;
  size?: string;
}

export function useTraderPositionQuery(positionKey: string) {
  return useQuery(
    ['traderPosition', positionKey],
    async () => {
      const { data } = await axios.get<Position>(
        `trader/positions/${positionKey}`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: !!positionKey,
    },
  );
}

export function useTraderPositionsQuery(pair?: string) {
  return useQuery(
    ['traderPositions', pair],
    async () => {
      const { data } = await axios.get<PositionsResponse>(
        `trader/positions?pair=${pair ?? ''}`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: !!pair,
    },
  );
}

export interface CreatePositionRequest {
  signal: Signal;
  withdraw_address: string;
  quote: string;
  quote_amount: string;
}

export interface CreatePositionResponse {
  warning?: string;
  gas_fee: string;
  deposit_address: string;
  position_key: string;
}

export const useCreateTraderInstanceMutation = () => {
  return useMutation(async () => {
    return await axios.post<null>('trader', {
      exchange: 'STONFI',
      market: 'SPOT',
      network: 'TON',
    });
  });
};

export const useTraderFirePositionMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateTraderInstanceMutation();
  return useMutation(
    async (body: CreatePositionRequest) => {
      await mutateAsync();
      const { data } = await axios.post<CreatePositionResponse>(
        'trader/positions',
        body,
      );
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['traderPositions']),
    },
  );
};

export const useTraderCancelPositionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (positionKey: string) => {
      return await axios.post<null>(`trader/positions/${positionKey}/cancel`);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['traderPositions']),
    },
  );
};

export interface UpdatePositionRequest {
  position_key: string;
  signal: Signal;
}

export const useTraderUpdatePositionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (body: UpdatePositionRequest) => {
      return await axios.post<null>('trader/positions/signal', body);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['traderPositions']),
    },
  );
};
