import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { type Signal } from 'api/builder';

export interface PositionsResponse {
  positions: Position[];
}

export interface Position {
  key: '12345...'; // key
  status: 'DRAFT'; // DRAFT, PENDING, OPENING, OPEN, CLOSED, CANCELED
  deposit_status: 'PENDING'; // PENDING, PAID, EXPIRED
  withdraw_status: ''; // "", "SENT", "PAID"
  pair: 'NOTUSDT';
  side: 'long'; // long or short
  signal: Signal; // same as the old terminal
  manager: unknown; // same as the old terminal
  trading_fee: '0.0'; // or null
  entry_price: '0.0'; // or null (avg)
  entry_time: '2024-10-07T04:35:13+00:00'; // or null
  exit_price: '0.0'; // or null (avg)
  exit_time: '2024-10-07T04:35:13+00:00'; // or null
  pnl: '0.0'; // or null: percentage
  stop_loss: '0.0'; // or null (avg)
  take_profit: '0.0'; // or null (avg)
  size: '0.0'; // percentage
}

export interface LastCandleResponse {
  symbol: {
    id: number;
    name: string;
    exchange: 'StonFi';
    market: 'SPOT';
    active: true;
    created_at: '2024-08-19T08:33:56.751373Z';
    updated_at: '2024-10-23T10:05:13.633585Z';
    deleted_at: null;
    pool_address: 'EQD8TJ8xEWB1SpnRE4d89YO3jl0W0EiBnNS4IBaHaUmdfizE';
  };
  candle: {
    symbol_id: 9125;
    related_at: '2024-10-25T13:56:00Z';
    resolution: '1m';
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
}

export function useLastCandleQuery() {
  return useQuery(
    ['lastCandle'],
    async () => {
      const { data } = await axios.get<LastCandleResponse>(
        'https://delphinus.wisdomise.com/candles/USD%E2%82%AETON/StonFi/SPOT/last',
      );
      return data;
    },
    {
      staleTime: 60 * 1000,
    },
  );
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

export function useTraderPositionsQuery(pair: string) {
  return useQuery(
    ['traderPositions', pair],
    async () => {
      const { data } = await axios.get<PositionsResponse>(
        `trader/positions?pair=${pair}`,
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
  return useMutation(
    async (body: CreatePositionRequest) => {
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
