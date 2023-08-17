import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type WithdrawNetworksResponse } from './types/withdrawNetworksResponse';

export const useWithdrawNetworksQuery = ({
  exchangeAccountKey,
  symbol,
}: {
  symbol?: string;
  exchangeAccountKey?: string;
}) =>
  useQuery<WithdrawNetworksResponse['results']>(
    ['withdrawNetworks'],
    async () => {
      if (!symbol || !exchangeAccountKey) throw new Error('unexpected');
      const { data } = await axios.get<WithdrawNetworksResponse>(
        `market/symbols/${symbol}/networks?withdrawable=true&exchange_account_key=${exchangeAccountKey}`,
      );
      return data.results;
    },
    { enabled: !!exchangeAccountKey && !!symbol },
  );
