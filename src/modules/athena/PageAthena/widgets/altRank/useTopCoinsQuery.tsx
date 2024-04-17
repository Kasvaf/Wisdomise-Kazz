import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TEMPLE_ORIGIN } from 'config/constants';

export const useTopCoinsQuery = () =>
  useQuery({
    queryKey: ['topCoins'],
    queryFn: async () => {
      const { data } = await axios.get<{ results: TopCoin[] }>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/lunar-crush/top-coins/`,
      );
      return data.results.sort((a, b) => (a.rank > b.rank ? 1 : -1));
    },
    cacheTime: 0,
  });

interface TopCoin {
  asset_id: string;
  name: string;
  logo: string;
  rank: number;
  current_price: number;
  percent_change: number;
  symbol: string;
}
