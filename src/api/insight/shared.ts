import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { resolvePageResponseToArray } from 'api/utils';
import { isMiniApp } from 'utils/version';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import {
  type Coin,
  type Category,
  type Exchange,
  type Network,
  type CoinLabels,
  type CoinDetails,
  type Pool,
  type NetworkSecurity,
  type CoinCommunityData,
} from '../types/shared';
import { matcher } from './utils';
import { type NetworkRadarNCoin } from './network';

export const useNetworks = (config: {
  filter?:
    | 'social-radar-24-hours'
    | 'technical-radar'
    | 'whale-radar'
    | 'coin-radar';
  query?: string;
}) =>
  useQuery({
    queryKey: ['networks', config.filter],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () => {
      const url =
        config?.filter === 'whale-radar'
          ? '/delphi/holders/networks/'
          : '/delphi/market/networks/';
      const needToAttachFilter = url === '/delphi/market/networks/';
      return resolvePageResponseToArray<Network>(url, {
        query: {
          ...(needToAttachFilter && {
            filter: config?.filter,
          }),
          page_size: 200,
        },
      });
    },
    select: data =>
      data.filter(row => {
        if (!matcher(config.query).string(`${row.name}-${row.slug}`))
          return false;
        return true;
      }),
  });

export const useExchanges = (config: {
  filter?: 'social-radar-24-hours' | 'technical-radar';
  query?: string;
}) =>
  useQuery({
    queryKey: ['exchanges', config.filter],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      ofetch<Exchange[]>('/delphi/market/exchanges/', {
        query: {
          filter: config?.filter,
        },
      }),
    select: data =>
      data.filter(row => {
        const query = config.query?.toLowerCase() ?? '';
        if (!!query && !row.name.toLowerCase().includes(query)) return false;
        return true;
      }),
  });

export const useCategories = (config: {
  filter?: 'social-radar-24-hours' | 'technical-radar';
  query?: string;
}) =>
  useQuery({
    queryKey: ['categories', config.filter],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      ofetch<Category[]>('/delphi/symbol-category/search/', {
        query: {
          filter: config.filter,
        },
      }),
    select: data =>
      data.filter(row => {
        const query = config.query?.toLowerCase() ?? '';
        if (!!query && !`${row.name}-${row.slug}`.toLowerCase().includes(query))
          return false;
        return true;
      }),
  });

export const useCoins = (config: {
  query?: string;
  tradableCoinsOnly?: boolean;
}) =>
  useQuery({
    queryKey: ['coins', config.query, config.tradableCoinsOnly],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      ofetch<Coin[]>('delphi/symbol/search/', {
        query: {
          q: config.query,
          network_name:
            isMiniApp && config.tradableCoinsOnly ? 'ton' : undefined,
          is_trading: config.tradableCoinsOnly ? true : undefined,
          page_size: 50,
        },
      }),
  });

interface DetailedCoin {
  symbol: Coin;
  symbol_community_links?: null | CoinCommunityData['links'];
  contract_address?: null | string;
  symbol_security?: null | NetworkSecurity;
  symbol_market_data?: {
    volume_24h?: null | number;
    market_cap?: null | number;
  };
  is_in_coingecko?: boolean | null;
  symbol_labels?: string[] | null;
}

export const useDetailedCoins = (config: {
  query?: string;
  network?: string;
}) => {
  const [globalNetwork] = useGlobalNetwork();
  const network = config.network ?? globalNetwork;
  return useQuery({
    queryKey: ['coinsV2', config.query, network],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      ofetch<DetailedCoin[]>('delphi/market/symbol-advanced-search/', {
        query: {
          q: config.query,
          network_slug: network,
        },
      }),
  });
};

export const useCoinLabels = (config: { query?: string }) =>
  useQuery({
    queryKey: ['coin-labels'],
    queryFn: async () => {
      const data = await ofetch<CoinLabels>(
        'delphi/intelligence/symbol-labels/',
      );
      return (
        data ?? {
          security_labels: [],
          trend_labels: [],
        }
      );
    },
    select: data => ({
      trend_labels: data.trend_labels.filter(row =>
        matcher(config.query).string(row),
      ),
      security_labels: data.security_labels.filter(row =>
        matcher(config.query).string(row),
      ),
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useCoinDetails = ({
  slug,
  priceHistoryDays,
  suspense,
}: {
  slug?: string;
  priceHistoryDays?: number;
  suspense?: boolean;
}) =>
  (suspense ? useSuspenseQuery : useQuery)({
    queryKey: ['coin-details', slug, priceHistoryDays ?? 1],
    queryFn: () => {
      if (!slug) return null;
      return ofetch<CoinDetails>('delphi/market/token-review/', {
        query: {
          slug,
          price_history_days: priceHistoryDays ?? 1,
        },
        meta: { auth: false },
      }).then(resp => ({
        ...resp,
        charts: (resp.charts ?? [])?.map(chart => ({
          ...chart,
          url:
            chart.type === 'trading_view'
              ? `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(
                  chart.id,
                )}`
              : chart.type === 'gecko_terminal'
              ? `https://www.geckoterminal.com/${chart.id}`
              : '',
          embedUrl:
            chart.type === 'gecko_terminal'
              ? `https://www.geckoterminal.com/${chart.id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`
              : '',
        })),
      }));
    },
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000,
  });

export const useNCoinDetails = ({
  slug,
  suspense,
}: {
  slug?: string;
  suspense?: boolean;
}) =>
  (suspense ? useSuspenseQuery : useQuery)({
    queryKey: ['ncoin-details', slug],
    queryFn: () => {
      if (!slug) return null;
      return resolvePageResponseToArray<NetworkRadarNCoin>(
        `delphi/market/new-born-pools/?base_slug=${slug}`,
        {
          meta: { auth: false },
        },
      ).then(resp => {
        if (resp.length !== 1) return null;
        return resp[0];
      });
    },
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
  });

export const useCoinPools = ({
  slug,
  network,
}: {
  slug?: string;
  network?: string;
}) =>
  useQuery({
    queryKey: ['pool-details', network, slug],
    queryFn: () => {
      if (!slug || !network) return null;
      return resolvePageResponseToArray<Pool>('delphi/market/symbol-pools/', {
        query: {
          symbol_slug: slug,
          network_slug: network,
        },
        meta: { auth: false },
      });
    },
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000,
  });
