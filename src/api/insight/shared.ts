import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { isMiniApp } from 'utils/version';
import {
  type Coin,
  type Category,
  type Exchange,
  type Network,
  type CoinLabels,
  type CoinDetails,
} from './types';

export const useNetworks = (config: {
  filter?: 'social-radar-24-hours' | 'technical-radar' | 'whale-radar';
  query?: string;
}) =>
  useQuery({
    queryKey: ['networks', config.filter],
    queryFn: () => {
      const url =
        config?.filter === 'whale-radar'
          ? '/delphi/holders/networks/'
          : '/delphi/market/networks/';
      const needToAttachFilter = config?.filter !== 'whale-radar';
      return ofetch<Network[]>(url, {
        query: {
          ...(needToAttachFilter && {
            filter: config?.filter,
          }),
        },
      });
    },
    select: data =>
      data.filter(row => {
        const query = config.query?.toLowerCase() ?? '';
        if (!!query && !`${row.name}-${row.slug}`.toLowerCase().includes(query))
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

export const useCoins = (config: { query?: string }) =>
  useQuery({
    queryKey: ['coins', config.query],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      ofetch<Coin[]>('delphi/symbol/search/', {
        query: {
          q: config.query,
          is_trading: isMiniApp ? true : undefined,
          page_size: 200,
        },
      }),
  });

export const useCoinLabels = () =>
  useQuery({
    queryKey: ['coin-labels'],
    queryFn: async () => {
      const data = await ofetch<CoinLabels>(
        'delphi/intelligence/symbol-labels/',
      );
      return data ?? [];
    },
  });

export const useCoinDetails = ({
  slug,
  priceHistoryDays,
}: {
  slug?: string;
  priceHistoryDays?: number;
}) =>
  useQuery({
    queryKey: ['coin-details', slug, priceHistoryDays ?? 1],
    queryFn: () =>
      ofetch<CoinDetails>('delphi/market/token-review/', {
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
      })),
    refetchInterval: 10 * 1000,
    enabled: !!slug,
  });
