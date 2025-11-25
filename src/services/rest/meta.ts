import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import type { PageResponse } from 'services/rest/types/page';

export interface Meta {
  id: number;
  type: 'micro';
  title: string;
  description: string;
  total_volume: number;
  total_market_cap: number;
  total_trench: number;
  activated_at: string;
  created_at: string;
  trench: MetaToken[];
}

export interface MetaToken {
  symbol: {
    slug: string;
    contract_address: string;
    name: string;
    abbreviation: string;
    logo_url: string;
    created_at: string;
    categories: unknown[];
  };
  symbol_community_links: {
    homepage: string[];
    twitter_screen_name: string;
  };
  symbol_security: unknown;
  symbol_market_data: {
    volume_24h: number;
    market_cap: number;
  };
  symbol_labels: string[];
}

export function useMetaListQuery({
  recentlyActive,
  recentlyCreated,
  maxTotalVolume,
  minTotalVolume,
  minTotalMarketCap,
  maxTotalMarketCap,
  skipSimilar,
  query,
}: {
  recentlyActive?: boolean;
  recentlyCreated?: boolean;
  minTotalVolume?: number;
  maxTotalVolume?: number;
  minTotalMarketCap?: number;
  maxTotalMarketCap?: number;
  skipSimilar?: boolean;
  query?: string;
}) {
  return useInfiniteQuery({
    queryKey: [
      'meta-list',
      recentlyActive,
      recentlyCreated,
      minTotalVolume,
      maxTotalVolume,
      minTotalMarketCap,
      maxTotalMarketCap,
      skipSimilar,
      query,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await ofetch<PageResponse<Meta>>(`delphi/meta/list/`, {
        query: {
          page: pageParam,
          recently_active: recentlyActive,
          recently_created: recentlyCreated,
          min_total_volume: minTotalVolume,
          max_total_volume: maxTotalVolume,
          min_total_market_cap: minTotalMarketCap,
          max_total_market_cap: maxTotalMarketCap,
          skip_similar: skipSimilar,
          query,
        },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
    },
    refetchInterval: 1000 * 60,
  });
}

export const useMetaDetailsQuery = (id: number) =>
  useQuery({
    queryKey: ['meta-details', id],
    queryFn: async () => {
      return await ofetch<Meta>(`delphi/meta/details/?id=${id}`);
    },
  });
