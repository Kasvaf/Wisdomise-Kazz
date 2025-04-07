import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { type MarketTypes } from './types/shared';

export type ExchangeTypes = 'BINANCE' | 'WISDOMISE';

export interface ExchangeAccount {
  key: string;
  title: string;
  total_equity?: number;
  exchange_name: ExchangeTypes;
  market_name: MarketTypes;
  status: 'RUNNING' | 'INACTIVE';
}

export const useExchangeAccountsQuery = () =>
  useQuery({
    queryKey: ['exchng-acc'],
    queryFn: async () => {
      const data = await ofetch<ExchangeAccount[]>('/ias/external-accounts');
      return data;
    },
  });

interface ExchangeAccountCreate {
  exchange_name: ExchangeTypes;
  market_name: MarketTypes;
  title: string;
  api_key: string;
  secret_key: string;
}
export const useCreateExchangeAccount = () => {
  const queryClient = useQueryClient();
  return async (acc: ExchangeAccountCreate) => {
    const data = await ofetch<ExchangeAccount>('/ias/external-accounts', {
      body: acc,
      method: 'pos',
    });
    await queryClient.invalidateQueries({ queryKey: ['exchng-acc'] });
    return data;
  };
};

export const useDeleteExchangeAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key }: { key: string }) => {
      await ofetch<ExchangeAccount>('/ias/external-accounts/' + key, {
        method: 'delete',
      });
      await queryClient.invalidateQueries({ queryKey: ['exchng-acc'] });
    },
  });
};
