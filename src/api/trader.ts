import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  type OpenOrderResponse,
  type SignalItem,
  type Signal,
} from 'api/builder';
import { useCoinOverview } from './coinRadar';

export interface PositionsResponse {
  positions: Position[];
}

export type PositionStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'OPENING'
  | 'OPEN'
  | 'CLOSING'
  | 'CLOSED'
  | 'CANCELED';

export interface Position {
  key: string;
  status: PositionStatus;
  deposit_status: 'PENDING' | 'PAID' | 'EXPIRED';
  withdraw_status?: 'SENT' | 'PAID';
  pair: string;
  side: 'long' | 'short';
  signal: Signal;
  manager?: {
    stop_loss?: SignalItem[];
    take_profit?: SignalItem[];
    open_orders?: OpenOrderResponse[];
  };
  trading_fee?: string;
  entry_price?: string;
  entry_time?: string;
  exit_price?: string;
  exit_time?: string;
  pnl?: string;
  current_total_equity: string;
  stop_loss?: string;
  take_profit?: string;
  size?: string;
  quote: string;
  base: string;
  current_assets: PositionAsset[];
  deposit_assets: PositionAsset[];
}

interface PositionAsset {
  amount: string;
  asset: string;
  is_gas_fee?: boolean;
}

export function isPositionUpdatable(position: Position) {
  return (
    position.status !== 'CLOSING' &&
    position.status !== 'CLOSED' &&
    position.status !== 'CANCELED' &&
    (position.status !== 'DRAFT' || position.deposit_status !== 'PENDING')
  );
}

export function initialQuoteDeposit(p: Position) {
  const result = p.deposit_assets.find(
    x => x.asset === p.quote && !x.is_gas_fee,
  )?.amount;
  return result === undefined ? undefined : Number(result);
}

export function useTraderPositionQuery(positionKey?: string) {
  return useQuery(
    ['traderPosition', positionKey],
    async () => {
      if (!positionKey) return;

      const { data } = await axios.get<Position>(
        `trader/positions/${positionKey}`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 30_000,
      enabled: !!positionKey,
    },
  );
}

export function useTraderPositionsQuery({
  slug,
  isOpen,
}: {
  slug?: string;
  isOpen?: boolean;
}) {
  const coinOverview = useCoinOverview({ slug });
  const pair = coinOverview?.data?.symbol.abbreviation
    ? `${coinOverview?.data?.symbol.abbreviation}USDT`
    : undefined;

  return useQuery(
    ['traderPositions', pair, isOpen],
    async () => {
      const { data } = await axios.get<PositionsResponse>('trader/positions', {
        params: {
          pair,
          is_open: isOpen,
        },
      });
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 30_000,
    },
  );
}

export interface CreatePositionRequest {
  signal: Signal;
  withdraw_address: string;
  quote: string;
  quote_amount: string;
}

export const usePreparePositionMutation = () => {
  const { mutateAsync } = useCreateTraderInstanceMutation();
  return useMutation(async (body: CreatePositionRequest) => {
    await mutateAsync();
    const { data } = await axios.post<{ gas_fee: string; warning?: string }>(
      'trader/positions/prepare',
      body,
    );
    return data;
  });
};

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

type TransactionStatus = 'processing' | 'failed' | 'completed';
interface TransactionOrder {
  type: 'stop_loss' | 'take_profit' | 'safety_open';
  data: {
    index: number;
    from_asset: string;
    from_amount: string;
    to_asset: string;
    to_amount?: string | null;
    gas_fee_asset: string;
    gas_fee_amount?: string | null;
    trading_fee_asset: string;
    trading_fee_amount?: string | null;
    time: string;
    status: TransactionStatus;
    link?: string | null;
  };
}

interface TransactionOpenClose {
  type: 'open' | 'open'; // (close swap, triggered by close signal)
  data: {
    from_asset: string;
    from_amount: string;
    to_asset: string;
    to_amount?: string | null; // nullable
    gas_fee_asset: string;
    gas_fee_amount?: string | null; // nullable
    trading_fee_asset: string;
    trading_fee_amount: string | null; // nullable
    time: string;
    status: TransactionStatus;
    link?: string | null;
  };
}

interface Asset {
  asset: string;
  amount: string;
}
interface TransactionDeposit {
  type: 'deposit';
  data: {
    assets: Asset[]; // is empty in "pending" status
    time: string;
    status: TransactionStatus; // (it can be seen on tonviewer but not confirmed), failed, completed
    link?: string | null;
  };
}

interface TransactionWithdraw {
  type: 'withdraw';
  data: {
    assets: Asset[];
    gas_fee_asset: string;
    gas_fee_amount?: string | null; // nullable
    time: string;
    status: TransactionStatus; // pending, processing (it can be seen on tonviewer but not confirmed), failed, completed
    link?: string | null;
  };
}

interface TransactionClose {
  type: 'close_event'; // "Closed" card, or cancel_event for "Canceled" card
  data: {
    time: string;
  };
}

type Transaction =
  | TransactionOrder
  | TransactionOpenClose
  | TransactionDeposit
  | TransactionWithdraw
  | TransactionClose;

export function useTraderPositionTransactionsQuery({
  positionKey,
}: {
  positionKey: string;
}) {
  return useQuery(
    ['position-transactions', positionKey],
    async () => {
      const { data } = await axios.get<{ transactions: Transaction[] }>(
        `trader/positions/${positionKey}/transactions`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 30_000,
    },
  );
}
