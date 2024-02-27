import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type RawPosition } from 'api/types/signalResponse';

interface SignalPosition {
  type: 'long' | 'short';
  order_type: 'limit' | 'market';
  price?: {
    // mandatory for limit orders
    value: number;
  };
  order_expires_at: string;
  suggested_action_expires_at: string;
}

interface Signal {
  action: 'open' | 'close';
  pair: string; // "BTC/USDT",
  leverage: {
    value: number;
  };
  position: SignalPosition;
  stop_loss: {
    price: {
      value: number;
    };
  };
  take_profit: {
    price: {
      value: number;
    };
  };
}

export interface FullPosition extends RawPosition {
  pair_name: string;
  leverage: number;
  stop_loss: number;
  take_profit: number;
  signal?: Signal;
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

interface CreateSignalInput extends Omit<Signal, 'leverage'> {
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
