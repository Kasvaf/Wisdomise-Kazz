import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type RawPosition } from 'api/types/signalResponse';

interface SignalPosition {
  type: 'long' | 'short';
  order_expires_at: string;
  suggested_action_expires_at: string;
}

// ----------------------------------------------------------------------------
export interface SignalItem {
  key: string;
  amount_ratio: number;
  price_exact?: number;
  price_ratio?: number;
  applied?: boolean;
  applied_at?: string | null;
}

// ----------------------------------------------------------------------------

export interface OpenOrderCondition {
  type: 'compare';
  op: '>=' | '<=';
  left: 'price';
  right: number;
}

export interface OpenOrderInput {
  key: string;
  amount?: number;
  price?: { value: number };
  order_type: 'limit' | 'market';
  condition:
    | OpenOrderCondition
    | {
        type: 'true';
      };
  applied?: boolean;
  applied_at?: string | null;
}

export interface OpenOrderResponse {
  key: string;
  amount?: number;
  price?: number;
  order_type: 'limit' | 'market';
  condition:
    | OpenOrderCondition
    | {
        type: 'true';
      };
  applied?: boolean;
  applied_at?: string | null;
}

export interface Signal {
  action: 'open' | 'close' | 'update';
  pair: string; // "BTC/USDT",
  leverage?: {
    value: number;
  };
  position: SignalPosition;
  stop_loss?: {
    items: SignalItem[];
  };
  take_profit?: {
    items: SignalItem[];
  };
  open_orders: {
    items: OpenOrderInput[];
  };
}

export interface FullPosition extends RawPosition {
  pair_name: string;
  leverage: number;
  stop_loss?: number | null;
  take_profit?: number | null;
  signal?: Signal;
  amount: number;
  manager?: {
    stop_loss?: SignalItem[];
    take_profit?: SignalItem[];
    open_orders?: OpenOrderResponse[];
  };
}

export const useMySignalerOpenPositions = (
  signaler?: string,
  assetName?: string,
) =>
  useQuery(
    ['signaler-op', signaler, assetName],
    async () => {
      if (!signaler) throw new Error('unexpected');
      const { data } = await axios.get<{ positions: FullPosition[] }>(
        `factory/strategies/${signaler}/open-positions`,
        { params: { asset_name: assetName } },
      );
      return data.positions;
    },
    {
      enabled: !!signaler,
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    },
  );

export const useMySignalerAllPositions = ({
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
    ['signaler-ap', signalerKey, assetName, startTime, endTime],
    async () => {
      if (!signalerKey) throw new Error('unexpected');
      const { data } = await axios.get<{ positions: FullPosition[] }>(
        `factory/strategies/${signalerKey}/positions`,
        {
          params: {
            asset_name: assetName,
            start_time: startTime,
            end_time: endTime,
          },
        },
      );
      return data.positions;
    },
    {
      enabled: !!signalerKey && !!startTime && !!endTime,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

interface CreateSignalInput extends Signal {
  signalerKey: string;
}

export const useFireSignalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, CreateSignalInput>(
    async ({ signalerKey, ...body }) => {
      const { data } = await axios.post<any>(
        `factory/strategies/${signalerKey}/signal`,
        body,
      );
      return data;
    },
    {
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries(['signaler-op']),
          queryClient.invalidateQueries(['signaler-ap']),
        ]),
    },
  );
};
