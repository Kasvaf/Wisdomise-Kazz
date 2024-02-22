import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_ORIGIN } from 'config/constants';

export const useTopTweetsQuery = () =>
  useQuery(['top_tweets'], async () => {
    const { data } = await axios.get<{ results: LunarCrushTweet[] }>(
      `${API_ORIGIN}/api/v0/delphi/lunar-crush/top-tweets/`,
    );
    return data.results.sort((a, b) => (a.rank > b.rank ? 1 : -1));
  });

export interface LunarCrushTweet {
  lunar_id: string;
  avatar: string;
  related_at: string;
  body: string;
  profile_image: string;
  twitter_screen_name: string;
  rank: number;
  url: string;
}
