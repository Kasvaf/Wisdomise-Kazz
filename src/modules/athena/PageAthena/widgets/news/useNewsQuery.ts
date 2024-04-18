import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TEMPLE_ORIGIN } from 'config/constants';

export const useNewsQuery = (limit?: number) =>
  useQuery(['news'], {
    queryFn: async () => {
      const { data } = await axios.get<Article[]>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/trading-view/latest-news/?${
          limit ? `limit=${limit}` : ''
        }`,
      );
      return data;
    },
  });

export interface Article {
  id: string;
  link: string;
  title: string;
  content?: string;
  published_at: string;
  image_link: string | null;
}
