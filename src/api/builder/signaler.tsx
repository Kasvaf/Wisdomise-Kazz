import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type MarketTypes } from 'api/types/financialProduct';

interface SignalerListItem {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  symbols: string[];
  open_positions: number;
  last_week_positions: number;
}

export const useMySignalersQuery = () =>
  useQuery(
    ['strategies'],
    async () => {
      const { data } = await axios.get<SignalerListItem[]>(
        '/factory/strategies',
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
