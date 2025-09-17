import { useQuery } from '@tanstack/react-query';
import type { PageResponse } from 'api/types/page';
import { ofetch } from 'config/ofetch';

interface Meta {
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
  contract_address: string;
  symbol_security: unknown;
  symbol_market_data: {
    volume_24h: number;
    market_cap: number;
  };
  symbol_labels: string[];
}

export function useMetaListQuery({
  recentlyActive,
  maxTotalVolume,
  minTotalVolume,
  minTotalMarketCap,
  maxTotalMarketCap,
  page,
}: {
  page?: number;
  recentlyActive?: boolean;
  minTotalVolume?: number;
  maxTotalVolume?: number;
  minTotalMarketCap?: number;
  maxTotalMarketCap?: number;
}) {
  return useQuery({
    queryKey: [
      'meta-list',
      page,
      recentlyActive,
      minTotalVolume,
      maxTotalVolume,
      minTotalMarketCap,
      maxTotalMarketCap,
    ],
    queryFn: async () => {
      const data = await ofetch<PageResponse<Meta>>(`delphi/meta/list/`, {
        query: {
          page,
          recently_active: recentlyActive,
          min_total_volume: minTotalVolume,
          max_total_volume: maxTotalVolume,
          min_total_market_cap: minTotalMarketCap,
          max_total_market_cap: maxTotalMarketCap,
        },
      });
      return data;
    },
  });
}
