import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type RawPosition } from 'api/types/signalResponse';

interface BaseSignalPosition {
  type: 'long' | 'short';
  order_expires_at: string;
  suggested_action_expires_at: string;
}

interface LimitOrder extends BaseSignalPosition {
  order_type: 'limit';
  price: {
    // mandatory for limit orders
    value: number;
  };
}

interface MarketOrder extends BaseSignalPosition {
  order_type: 'market';
  price?: {
    value?: number;
  };
}

type SignalPosition = LimitOrder | MarketOrder;

interface FullPosition extends RawPosition {
  pair_name: string;
  leverage: number;
  stop_loss: number;
  take_profit: number;
  signal?: {
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
    ['signaler-op', signalerKey, assetName, startTime, endTime],
    async () => {
      if (!signalerKey) throw new Error('unexpected');
      const { data } = await axios.get<{ positions: FullPosition[] }>(
        `factory/strategies/${signalerKey}/open-positions`,
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
      enabled: !!signalerKey && !!assetName && !!startTime && !!endTime,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
