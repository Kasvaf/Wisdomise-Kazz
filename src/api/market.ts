import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type NetworksResponse } from './types/NetworksResponse';
import { type PageResponse } from './types/page';

type Usage = 'depositable' | 'withdrawable';

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
export interface Exchange {
  key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  exchange_name: string;
  market_name: string;
}

export const useMarketExchangesQuery = () =>
  useQuery(['exchanges'], async () => {
    const { data } = await axios.get<PageResponse<Exchange>>(
      'market/exchange-markets',
    );
    return data.results;
  });

export const useNetworks = () =>
  useQuery({
    queryKey: ['networks'],
    queryFn: () =>
      axios
        .get<
          Array<{
            abbreviation: string;
            icon_url: string;
            id: number;
            name: string;
          }>
        >('/delphi/market/networks/')
        .then(({ data }) => data),
  });
