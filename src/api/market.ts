import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  type CryptosResponse,
  type NetworksResponse,
} from './types/NetworksResponse';

export const useDepositSymbolsQuery = () =>
  useQuery<CryptosResponse['results']>(
    ['depositSymbols'],
    async () => {
      const { data } = await axios.get<CryptosResponse>(
        'market/symbols?depositable=true',
      );
      return data.results;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useWithdrawNetworksQuery = ({
  exchangeAccountKey,
  symbol,
}: {
  symbol?: string;
  exchangeAccountKey?: string;
}) =>
  useQuery<NetworksResponse['results']>(
    ['withdrawNetworks', symbol, exchangeAccountKey],
    async () => {
      if (!symbol || !exchangeAccountKey) throw new Error('unexpected');
      const { data } = await axios.get<NetworksResponse>(
        `market/symbols/${symbol}/networks?withdrawable=true&exchange_account_key=${exchangeAccountKey}`,
      );
      return data.results;
    },
    { enabled: !!exchangeAccountKey && !!symbol },
  );

export const useDepositNetworksQuery = ({ symbol }: { symbol?: string }) =>
  useQuery<NetworksResponse['results']>(
    ['depositNetworks', symbol],
    async () => {
      if (!symbol) throw new Error('unexpected');
      const { data } = await axios.get<NetworksResponse>(
        `market/symbols/${symbol}/networks?depositable=true`,
      );
      return data.results;
    },
    { enabled: !!symbol },
  );
