import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import {
  type OpenOrderResponse,
  type SignalItem,
  type Signal,
} from 'api/builder';
import { ofetch } from 'config/ofetch';
import { type WhaleCoin, type WhaleCoinsFilter } from './whale';
import { type PageResponse } from './types/page';
import { type Coin } from './types/shared';

export interface UserAssetPair {
  slug: string;
  usd_equity: number;
  amount: number;
  position_keys: string[];
}

export const useUserAssets = () => {
  return useQuery(
    ['user-assets'],
    async () => {
      const data = await ofetch<{
        symbols: Array<{
          slug: string;
          amount: string;
          usd_equity: string;
          position_keys: string[];
        }>;
      }>('/trader/overview');

      return data.symbols.map(
        x =>
          ({
            slug: x.slug,
            usd_equity: Number(x.usd_equity),
            amount: Number(x.amount),
            position_keys: x.position_keys,
          }) satisfies UserAssetPair,
      );
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 30_000,
    },
  );
};

export const useSupportedPairs = (baseSlug?: string) => {
  return useQuery(
    ['supported-pairs', baseSlug],
    async () => {
      if (!baseSlug) return [];
      const data = await ofetch<{
        results: Array<{
          id: string;
          name: string; // pair name
          base: Coin;
          quote: Coin;
        }>;
      }>('/delphi/market/pairs/', {
        query: {
          base_slug: baseSlug,
          network_name: 'ton',
          exchange_name: 'STONFI',
        },
      });
      return data.results;
    },
    {
      staleTime: Number.MAX_VALUE,
    },
  );
};

export const useTraderCoins = (filters?: {
  page: number;
  pageSize: number;
  sortBy?: string;
  isAscending?: boolean;
  networkName?: string;
  filter?: WhaleCoinsFilter;
  days?: number;
}) =>
  useQuery({
    queryKey: ['trader-coins', JSON.stringify(filters)],
    keepPreviousData: true,
    queryFn: async () => {
      const data = await ofetch<PageResponse<WhaleCoin>>(
        '/delphi/intelligence/trader-top-coins/',
        {
          query: {
            page_size: filters?.pageSize ?? 10,
            page: filters?.page ?? 1,
            days: filters?.days ?? 1,
            network_name: filters?.networkName,
            exchange_name: 'STONFI',
            sorted_by: filters?.sortBy,
            ascending:
              typeof filters?.isAscending === 'boolean'
                ? filters?.isAscending
                  ? 'True'
                  : 'False'
                : undefined,
            filter: filters?.filter ?? 'all',
          },
          meta: { auth: true },
        },
      );
      return data;
    },
  });

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
  id: number;
  key: string;
  status: PositionStatus;
  deposit_status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELED';
  withdraw_status?: 'SENT' | 'PAID';
  pair_name: string;
  pair_slug: string;
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
  current_total_quote_equity: string;
  current_total_usd_equity: string;
  stop_loss?: string;
  take_profit?: string;
  size?: string;
  quote_name: string;
  quote_slug: string;
  base_name: string;
  base_slug: string;
  current_assets: PositionAsset[];
  deposit_assets: PositionAsset[];
  final_quote_amount?: string;
}

interface PositionAsset {
  amount: string;
  asset_slug: string;
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
    x => x.asset_slug === p.quote_slug && !x.is_gas_fee,
  )?.amount;
  return result === undefined ? undefined : Number(result);
}

export function useTraderPositionQuery(positionKey?: string) {
  return useQuery(
    ['traderPosition', positionKey],
    async () => {
      if (!positionKey) return;

      const data = await ofetch<Position>(`trader/positions/${positionKey}`);
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 10_000,
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
  return useQuery(
    ['traderPositions', slug, isOpen],
    async () => {
      const data = await ofetch<PositionsResponse>('trader/positions', {
        query: {
          base_slug: slug || undefined,
          is_open: isOpen,
        },
      });
      return data;
    },
    {
      staleTime: 10,
      refetchInterval: 20_000,
    },
  );
}

export interface CreatePositionRequest {
  signal: Signal;
  withdraw_address: string;
  quote_slug: string;
  quote_amount: string;
}

export const usePreparePositionMutation = () => {
  const { mutateAsync } = useCreateTraderInstanceMutation();
  return useMutation(async (body: CreatePositionRequest) => {
    await mutateAsync();
    const data = await ofetch<{ gas_fee: string; warning?: string }>(
      'trader/positions/prepare',
      { body, method: 'post' },
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
    return await ofetch<null>('trader', {
      body: {
        exchange: 'STONFI',
        market: 'SPOT',
        network_slug: 'the-open-network',
      },
      method: 'post',
    });
  });
};

export const useTraderFirePositionMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useCreateTraderInstanceMutation();
  return useMutation(
    async (body: CreatePositionRequest) => {
      await mutateAsync();
      const data = await ofetch<CreatePositionResponse>('trader/positions', {
        body,
        method: 'post',
      });
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
      return await ofetch<null>(`trader/positions/${positionKey}/cancel`, {
        method: 'post',
      });
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
      try {
        return await ofetch<null>('trader/positions/signal', {
          body,
          method: 'post',
        });
      } catch (error) {
        if (error instanceof FetchError && error.status === 409) {
          await queryClient.invalidateQueries([
            'traderPosition',
            body.position_key,
          ]);
          throw new Error(
            'Position state is changed, please review and fire again!',
          );
        }
        throw error;
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['traderPositions']),
    },
  );
};

export type TransactionStatus = 'processing' | 'failed' | 'completed';
export interface TransactionOrder {
  type: 'stop_loss' | 'take_profit' | 'safety_open';
  data: {
    index: number;
    from_asset_name: string;
    from_asset_slug: string;
    from_amount: string;
    to_asset_name: string;
    to_asset_slug: string;
    to_amount?: string | null;
    gas_fee_asset_name: string;
    gas_fee_asset_slug: string;
    gas_fee_amount?: string | null;
    trading_fee_asset: string;
    trading_fee_amount?: string | null;
    time: string;
    status: TransactionStatus;
    link?: string | null;
  };
}

export interface TransactionOpenClose {
  type: 'open' | 'close'; // (close swap, triggered by close signal)
  data: {
    from_asset_name: string;
    from_asset_slug: string;
    from_amount: string;
    to_asset_name: string;
    to_asset_slug: string;
    to_amount?: string | null; // nullable
    gas_fee_asset_name: string;
    gas_fee_asset_slug: string;
    gas_fee_amount?: string | null; // nullable
    trading_fee_asset: string;
    trading_fee_amount: string | null; // nullable
    time: string;
    status: TransactionStatus;
    link?: string | null;
  };
}

interface Asset {
  asset_name: string;
  asset_slug: string;
  amount: string;
}
export interface TransactionDeposit {
  type: 'deposit';
  data: {
    assets: Asset[]; // is empty in "pending" status
    time: string;
    status: TransactionStatus; // (it can be seen on tonviewer but not confirmed), failed, completed
    link?: string | null;
  };
}

export interface TransactionWithdraw {
  type: 'withdraw';
  data: {
    assets: Asset[];
    gas_fee_asset_name: string;
    gas_fee_asset_slug: string;
    gas_fee_amount?: string | null; // nullable
    time: string;
    status: TransactionStatus; // pending, processing (it can be seen on tonviewer but not confirmed), failed, completed
    link?: string | null;
  };
}

export interface TransactionClose {
  type: 'close_event'; // "Closed" card, or cancel_event for "Canceled" card
  data: {
    time: string;
  };
}

export type Transaction =
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
      const data = await ofetch<{ transactions: Transaction[] }>(
        `trader/positions/${positionKey}/transactions`,
      );
      return data.transactions;
    },
    {
      staleTime: 10_000,
      refetchInterval: 30_000,
    },
  );
}
