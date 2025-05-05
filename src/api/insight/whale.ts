import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { TEMPLE_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';
import { resolvePageResponseToArray } from 'api/utils';
import { type PageResponse } from '../types/page';
import {
  type NetworkSecurity,
  type Coin,
  type MiniMarketData,
  type MarketData,
  type CoinNetwork,
} from '../types/shared';
import { createSorter, matcher } from './utils';

export interface WhaleShort {
  rank: number;
  holder_address: string;
  network_name: string;
  network_icon_url: string;
  balance_usdt?: null | number;
  recent_transfer_volume?: null | number;
  recent_trading_volume?: null | number;
  recent_trading_pnl?: null | number;
  recent_trading_pnl_percentage?: null | number;
  total_profit_last_ndays?: null | number;
  total_profit_last_ndays_percent?: null | number;
  recent_trading_wins?: null | number;
  recent_trading_losses?: null | number;
  recent_total_buys?: null | number;
  recent_total_sells?: null | number;
  recent_in_flow?: null | number;
  recent_out_flow?: null | number;
  recent_average_trades_per_day?: null | number;
  recent_average_trade_duration_seconds?: null | number;
  realized_profit_last_ndays?: null | number;
  realized_profit_last_ndays_percent?: null | number;
  unrealized_profit_last_ndays?: null | number;
  unrealized_profit_last_ndays_percent?: null | number;
  total_trading_assets?: null | number;
  total_holding_assets?: null | number;
  top_assets: Array<{
    symbol: Coin;
    amount?: null | number;
    worth?: null | number;
    label?: null | string;
    recent_trading_pnl?: null | number;
    recent_trading_pnl_percentage?: null | number;
    total_profit_last_ndays?: null | number;
    total_profit_last_ndays_percent?: null | number;
  }>;
}

export type WhalesFilter =
  | 'all'
  | 'best_to_copy'
  | 'holders'
  | 'wealthy_wallets';

export const useWhaleRadarWhales = (config: {
  networkNames?: string[];
  query?: string;
}) =>
  useQuery({
    queryKey: ['whale-radar-whales'],
    queryFn: async () => {
      const data = await resolvePageResponseToArray<WhaleShort>(
        'delphi/holders/tops/',
        {
          query: {
            page_size: 99,
          },
        },
      );
      return data;
    },
    select: data =>
      data.filter(row => {
        if (
          !matcher(config?.networkNames).array([row.network_name]) ||
          !matcher(config?.query).string(row.holder_address)
        )
          return false;
        return true;
      }),
    meta: {
      persist: true,
    },
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });

export interface WhaleCoin {
  rank: number;
  symbol: Coin;
  network_slugs: string[];
  total_buy_volume?: number | null;
  total_buy_number?: number | null;
  total_sell_volume?: number | null;
  total_sell_number?: number | null;
  total_transfer_volume?: number | null;
  total_holding_volume?: number | null;
  total_recent_trading_pnl?: number | null;
  market_data?: null | {
    current_price?: number | null;
    price_change_24h?: number | null;
    price_change_percentage_24h?: number | null;
    market_cap?: number | null;
    total_supply?: number | null;
    circulating_supply?: number | null;
  };
}
export type WhaleCoinsFilter = 'all' | 'buy' | 'sell' | 'total_volume' | 'hold';

export interface SingleWhale {
  holder_address: string;
  network_name: string;
  network_icon_url?: null | string;
  last_30_balance_updates?: null | Array<{
    related_at_date: string;
    balance_usdt: number;
  }>;
  last_30_days_in_out_flow?: null | Array<{
    related_at_date: string;
    today_in_flow: number;
    today_out_flow: number;
  }>;
  last_30_days_pnls?: null | Array<{
    related_at_date: string;
    total_profit_last_ndays?: number;
    recent_trading_pnl?: number;
  }>;
  recent_trading_pnl_percentage?: null | number;
  recent_trading_realized_pnl_percentage?: null | number;
  recent_trading_pnl?: null | number;
  recent_trading_realized_pnl?: null | number;
  total_recent_transfers?: null | number;
  total_recent_transfer_volume?: null | number;
  last_30_days_balance_change?: null | number;
  last_30_days_balance_change_percentage?: null | number;
  recent_trading_volume?: null | number;
  recent_trading_wins?: null | number;
  recent_trading_losses?: null | number;
  recent_average_trades_per_day?: null | number;
  recent_average_trade_duration_seconds?: null | number;
  recent_number_of_trades?: null | number;
  recent_largest_win?: null | number;
  recent_largest_loss?: null | number;
  total_profit_last_ndays?: null | number;
  total_profit_last_ndays_percent?: null | number;
  realized_profit_last_ndays?: null | number;
  realized_profit_last_ndays_percent?: null | number;
  unrealized_profit_last_ndays?: null | number;
  unrealized_profit_last_ndays_percent?: null | number;
  assets: Array<{
    amount?: null | number;
    label?: null | WhaleAssetLabel;
    total_recent_buys?: null | number;
    total_recent_sells?: null | number;
    total_recent_buy_volume?: null | number;
    total_recent_sell_volume?: null | number;
    total_recent_buy_amount?: null | number;
    total_recent_sell_amount?: null | number;
    total_recent_transfers?: null | number;
    total_recent_volume_transferred?: null | number;
    recent_avg_trade_duration_seconds?: null | number;
    recent_trading_pnl?: null | number;
    recent_trading_pnl_percentage?: null | number;
    total_profit_last_ndays?: null | number;
    total_profit_latst_ndays_percent?: null | number;
    realized_profit_last_ndays?: null | number;
    realized_profit_latst_ndays_percent?: null | number;
    unrealized_profit_last_ndays?: null | number;
    unrealized_profit_latst_ndays_percent?: null | number;
    market_data: MarketData;
    last_30_days_price_change?: null | number;
    worth?: null | number;
    symbol: Coin;
    recent_avg_cost?: null | number;
    recent_avg_sold?: null | number;
    remaining_percent?: null | number;
    symbol_labels?: null | string[];
    symbol_security?: null | {
      data: NetworkSecurity[];
    };
    networks?: null | CoinNetwork[];
  }>;
  scanner_link?: null | {
    name: string;
    url: string;
  };
}

export const useWhaleDetails = (filters: {
  holderAddress: string;
  networkName: string;
}) =>
  useQuery({
    queryKey: ['whale-details', JSON.stringify(filters)],
    queryFn: async () => {
      const data = await ofetch<SingleWhale>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/holders/holder-details/`,
        {
          query: {
            holder_address: filters.holderAddress,
            network_name: filters.networkName,
          },
        },
      );
      return data;
    },
  });

export const useWhaleNetworks = () =>
  useQuery({
    queryKey: ['whale-networks'],
    queryFn: () =>
      ofetch<
        PageResponse<{
          icon_url: string;
          id: number;
          name: string;
          slug: string;
        }>
      >('/delphi/holders/networks/'),
  });

export interface WhaleRadarSentiment {
  total_buy_volume?: null | number;
  total_buy_number?: null | number;
  total_sell_volume?: null | number;
  total_sell_number?: null | number;
  chart_data?: null | Array<{
    buys_number?: null | number;
    sells_number?: null | number;
    price: number;
    related_at: string;
  }>;
  buy_percent?: null | number;
  sell_percent?: null | number;
  hold_percent?: null | number;
  wallet_count?: null | number;
  label_percents: Array<[WhaleAssetLabel, number]>;
}
export const useWhaleRadarSentiment = ({ slug }: { slug: string }) =>
  useQuery({
    queryKey: ['whale-sentiment', slug],
    queryFn: () =>
      ofetch<WhaleRadarSentiment>('/delphi/holders/sentiment/', {
        query: {
          slug,
        },
      }).then(resp => {
        if (resp.label_percents.length === 0) return null;
        return resp;
      }),
  });

export interface WhaleRadarCoin extends WhaleRadarSentiment {
  rank: number;
  symbol: Coin;
  total_transfer_volume: number;
  total_holding_volume: number;
  total_recent_trading_pnl: number;
  profitable: boolean;
  top_5_holders_info: Array<{
    address: string;
    network_name: string;
  }>;
  networks: CoinNetwork[];
  data?: null | MiniMarketData;
  symbol_security?: null | {
    data: NetworkSecurity[];
  };
  symbol_labels: string[];
}

export const useWhaleRadarCoins = (config: {
  days: number;
  sortBy?: string;
  sortOrder?: 'ascending' | 'descending';
  query?: string;
  categories?: string[];
  networks?: string[];
  securityLabels?: string[];
  trendLabels?: string[];
  profitableOnly?: boolean;
  excludeNativeCoins?: boolean;
}) =>
  useQuery({
    queryKey: ['whale-radar-coins', config.days],
    queryFn: () =>
      resolvePageResponseToArray<WhaleRadarCoin>('delphi/holders/top-coins/', {
        query: {
          days: config.days,
          page_size: 500,
        },
        meta: { auth: false },
      }),
    select: data =>
      data
        .filter(row => {
          if (
            !matcher(config.query).coin(row.symbol) ||
            !matcher(config.categories).array(
              row.symbol.categories?.map(x => x.slug),
            ) ||
            !matcher(config.networks).array(
              row.networks.map(x => x.network.slug),
            ) ||
            !matcher(config.trendLabels).array(row.symbol_labels) ||
            !matcher(config.securityLabels).security(
              row.symbol_security?.data,
            ) ||
            (config.profitableOnly && !row.profitable) ||
            (config.excludeNativeCoins &&
              row.networks.some(x => x.symbol_network_type === 'COIN'))
          )
            return false;
          return true;
        })
        .sort((a, b) => {
          const sorter = createSorter(config.sortOrder);
          if (config.sortBy === 'price_change')
            return sorter(
              a.data?.price_change_percentage_24h ?? 0,
              b.data?.price_change_percentage_24h ?? 0,
            );

          if (config.sortBy === 'market_cap')
            return sorter(a.data?.market_cap ?? 0, b.data?.market_cap ?? 0);

          if (config.sortBy === 'buy')
            return sorter(a.total_buy_volume, b.total_buy_volume);
          if (config.sortBy === 'sell')
            return sorter(a.total_sell_volume, b.total_sell_volume);
          if (config.sortBy === 'transfer')
            return sorter(a.total_transfer_volume, b.total_transfer_volume);
          if (config.sortBy === 'wallet_count')
            return sorter(a.wallet_count, b.wallet_count);
          return sorter(a.rank, b.rank);
        }),
    meta: {
      persist: true,
    },
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });

export type WhaleAssetLabel =
  | 'holding'
  | 'unloading'
  | 'loading'
  | 'new_investment'
  | 'exit_portfolio'
  | 'dust'
  | 'stable'
  | 'trading';

export interface CoinWhale {
  holder_address: string;
  network_name: string;
  network_icon_url: string;
  asset: {
    id?: null | number;
    key?: null | string;
    is_active?: null | boolean;
    created_at?: null | string;
    updated_at?: null | string;
    holder_id?: null | number;
    coin_id?: null | string;
    related_at_date?: null | string;
    amount?: null | number;
    worth?: null | number;
    label?: null | WhaleAssetLabel;
    last_label_action_datetime?: string | null;
    total_recent_transfers?: null | number;
    total_recent_buys?: null | number;
    total_recent_buy_volume?: null | number;
    total_recent_buy_amount?: null | number;
    total_recent_sells?: null | number;
    total_recent_sell_volume?: null | number;
    total_recent_sell_amount?: null | number;
    total_profit_last_ndays?: null | number;
    total_profit_last_ndays_percent?: null | number;
    realized_profit_last_ndays?: null | number;
    realized_profit_last_ndays_percent?: null | number;
    unrealized_profit_last_ndays?: null | number;
    unrealized_profit_last_ndays_percent?: null | number;
    number_of_wins_last_ndays?: null | number;
    number_of_losses_last_ndays?: null | number;
    largest_win_last_ndays?: null | number;
    largest_loss_last_ndays?: null | number;
    avg_cost_last_ndays?: null | number;
    avg_sold_last_ndays?: null | number;
    remaining_percent?: null | number;
    updated_worth?: null | number;
    pnl?: null | number;
    pnl_percent?: null | number;
    recent_trading_pnl?: null | number;
    recent_trading_pnl_percentage?: null | number;
    total_recent_volume_transferred?: null | number;
  };
}

export const useCoinWhales = (config: {
  slug: string;
  type?: 'active' | 'holding';
}) =>
  useQuery({
    queryKey: ['coin-whales', config.slug],
    queryFn: () =>
      resolvePageResponseToArray<CoinWhale>('/delphi/holders/with-coin/', {
        query: {
          slug: config.slug,
          page_size: 99,
        },
      }),
    select: data =>
      data.filter(x => {
        if (config.type === 'active' && x.asset.label === 'holding')
          return false;
        if (config.type === 'holding' && x.asset.label !== 'holding')
          return false;
        return true;
      }),
  });

export interface WhaleTransaction {
  symbol_slug: string;
  transaction_type: 'Sent' | 'Received';
  amount?: number | null;
  price?: number | null;
  worth?: number | null;
  profit?: number | null;
  related_at_datetime: string;
  symbol?: Coin | null;
  coinstats_info?: Pick<Coin, 'abbreviation' | 'logo_url' | 'name'> | null;
  link?: null | {
    name: string;
    url: string;
  };
}

export const useWhaleTransactions = (config: {
  slug?: string;
  holderAddress: string;
  networkName: string;
  pageSize: number;
  // page: number;
}) =>
  useInfiniteQuery({
    queryKey: [
      'whale-transactions',
      config.slug,
      config.holderAddress,
      config.networkName,
      // config.page,
      config.pageSize,
    ],
    queryFn: ({ pageParam = 1 }) =>
      ofetch<PageResponse<WhaleTransaction>>('delphi/holders/transactions/', {
        query: {
          holder_address: config.holderAddress,
          network_name: config.networkName,
          slug: config.slug,
          page_size: config.pageSize,
          page: pageParam,
        },
        meta: { auth: false },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
    },
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });
