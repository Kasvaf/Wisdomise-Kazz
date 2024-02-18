import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_ORIGIN } from 'config/constants';

export const useTopNFTsQuery = () =>
  useQuery(
    ['top_nft'],
    async () => {
      const { data } = await axios.get<{ results: LunarCrushNFT[] }>(
        `${API_ORIGIN}/api/v0/delphi/lunar-crush/top-nfts/`,
      );
      return data.results.sort((a, b) => (a.rank > b.rank ? 1 : -1));
    },
    { cacheTime: 0 },
  );

interface LunarCrushNFT {
  lunar_id: string;
  rank: number;
  logo: string;
  name: string;
  current_price: number;
  percent_change: number;
  nft_rank: number;
}
