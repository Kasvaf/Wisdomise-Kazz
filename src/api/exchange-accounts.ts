import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { type MarketTypes } from './types/financialProduct';

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
  useQuery(['exchng-acc'], async () => {
    const { data } = await axios.get<ExchangeAccount[]>(
      '/ias/external-accounts',
    );
    return data;
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
    const { data } = await axios.post<ExchangeAccount>(
      '/ias/external-accounts',
      acc,
    );
    await queryClient.invalidateQueries(['exchng-acc']);
    return data;
  };
};
