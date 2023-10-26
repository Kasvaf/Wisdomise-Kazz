import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  type CryptosResponse,
  type NetworksResponse,
} from './types/NetworksResponse';

type Usage = 'depositable' | 'withdrawable';

export const useMarketSymbolsQuery = (usage: Usage) =>
  useQuery<CryptosResponse['results']>(
    ['symbols', usage],
    async () => {
      const { data } = await axios.get<CryptosResponse>(
        `market/symbols?${usage}=true`,
      );
      return data.results;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useMarketNetworksQuery = ({
  usage,
  symbol,
  exchangeAccountKey,
}: {
  usage: Usage;
  symbol?: string;
  exchangeAccountKey?: string;
}) =>
  useQuery<NetworksResponse['results']>(
    ['networks', symbol, usage],
    async () => {
      if (!symbol) throw new Error('unexpected');
      const { data } = await axios.get<NetworksResponse>(
        `market/symbols/${symbol}/networks?${usage}=true`,
        { params: { exchange_account_key: exchangeAccountKey } },
      );
      return data.results;
    },
    { enabled: !!exchangeAccountKey && !!symbol },
  );
