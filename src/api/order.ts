import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PageResponse } from 'api/types/page';
import { ofetch } from 'config/ofetch';

export type OrderStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED';

export interface CreateOrderRequest {
  network_slug: 'solana';
  base_address: string;
  quote_address: string;
  wallet_address: string;
  type: 'BUY_ABOVE' | 'BUY_BELOW' | 'SELL_ABOVE' | 'SELL_BELOW';
  price: string;
  amount: string;
  price_in_usd: boolean;
  priority_fee: string;
  slippage: string;
}

export interface Order extends CreateOrderRequest {
  key: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export const useOrdersQuery = ({
  baseAddress,
  quoteAddress,
  walletAddress,
  status,
  priceInUsd,
  page = 1,
  size = 999,
}: {
  baseAddress?: string;
  quoteAddress?: string;
  walletAddress?: string;
  status?: OrderStatus;
  priceInUsd?: boolean;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: [
      'limit-orders',
      baseAddress,
      quoteAddress,
      walletAddress,
      status,
      priceInUsd,
      page,
      size,
    ],
    queryFn: async () => {
      const data = await ofetch<PageResponse<Order>>('trader/limit-orders', {
        query: {
          base_address: baseAddress,
          quote_address: quoteAddress,
          wallet_address: walletAddress,
          status: status,
          price_in_usd: priceInUsd,
          page: page,
          size: size,
        },
      });
      return data;
    },
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 10,
  });
};

export const useOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateOrderRequest) => {
      return await ofetch('trader/limit-orders', { method: 'post', body });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['limit-orders'] });
    },
  });
};

export const useOrderCancelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      return await ofetch(`trader/limit-orders/${key}/cancel`, {
        method: 'post',
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['limit-orders'] });
    },
  });
};
