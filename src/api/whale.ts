import { useQuery } from '@tanstack/react-query';
import { TEMPLE_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';
import { type PageResponse } from './types/page';
import { type Coin } from './types/shared';

export interface WhaleShort {
  rank: number;
  holder_address: string;
  network_name: string;
  network_icon_url?: string | null;
  balance_usdt?: number | null;
  recent_transfer_volume?: number | null;
  recent_trading_volume?: number | null;
  recent_trading_pnl?: number | null;
  recent_trading_pnl_percentage?: number | null;
  recent_trading_wins?: number | null;
  recent_trading_losses?: number | null;
  recent_total_buys?: number | null;
  recent_total_sells?: number | null;
  recent_in_flow?: number | null;
  recent_out_flow?: number | null;
  recent_average_trades_per_day?: number | null;
  recent_average_trade_duration_seconds?: number | null;
  total_trading_assets?: number | null;
  total_holding_assets?: number | null;
  top_assets: Array<{
    symbol: Coin;
    amount?: number | null;
    worth?: number | null;
    label:
      | SingleWhale['holding_assets'][number]['label']
      | SingleWhale['trading_assets'][number]['label'];
    recent_trading_pnl?: number | null;
    recent_trading_pnl_percentage?: number | null;
  }>;
}

export type WhalesFilter =
  | 'all'
  | 'best_to_copy'
  | 'holders'
  | 'wealthy_wallets';

export const useWhales = (filters?: {
  page: number;
  pageSize: number;
  sortBy?: string;
  isAscending?: boolean;
  networkName?: string;
  filter?: WhalesFilter;
}) =>
  useQuery({
    queryKey: ['whales', JSON.stringify(filters)],
    keepPreviousData: true,
    queryFn: async () => {
      const data = await ofetch<PageResponse<WhaleShort>>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/holders/tops/`,
        {
          query: {
            page_size: filters?.pageSize ?? 10,
            page: filters?.page ?? 1,
            sorted_by: filters?.sortBy,
            ascending:
              typeof filters?.isAscending === 'boolean'
                ? filters?.isAscending
                  ? 'True'
                  : 'False'
                : undefined,
            network_name: filters?.networkName,
            filter: filters?.filter ?? 'all',
          },
        },
      );
      return data;
    },
  });
export interface WhaleCoin {
  rank: number;
  symbol: Coin;
  total_buy_volume?: number | null;
  total_buy_number?: number | null;
  total_sell_volume?: number | null;
  total_sell_number?: number | null;
  total_transfer_volume?: number | null;
  total_holding_volume?: number | null;
  total_recent_trading_pnl?: number | null;
  market_data: {
    current_price?: number | null;
    price_change_24h?: number | null;
    price_change_percentage_24h?: number | null;
    market_cap?: number | null;
    total_supply?: number | null;
    circulating_supply?: number | null;
  };
}
export type WhaleCoinsFilter = 'all' | 'buy' | 'sell' | 'total_volume' | 'hold';

export const useWhalesCoins = (filters?: {
  page: number;
  pageSize: number;
  sortBy?: string;
  isAscending?: boolean;
  networkName?: string;
  filter?: WhaleCoinsFilter;
  days?: number;
}) =>
  useQuery({
    queryKey: ['whales-coins', JSON.stringify(filters)],
    keepPreviousData: true,
    queryFn: async () => {
      const data = await ofetch<PageResponse<WhaleCoin>>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/holders/top-coins/`,
        {
          query: {
            page_size: filters?.pageSize ?? 10,
            page: filters?.page ?? 1,
            days: filters?.days ?? 1,
            network_name: filters?.networkName,
            sorted_by: filters?.sortBy,
            ascending:
              typeof filters?.isAscending === 'boolean'
                ? filters?.isAscending
                  ? 'True'
                  : 'False'
                : undefined,
            filter: filters?.filter ?? 'all',
          },
          meta: { auth: false },
        },
      );
      return data;
    },
  });

export interface SingleWhale {
  holder_address: string;
  network_name: string;
  network_icon_url?: string | null;
  last_30_balance_updates: Array<{
    related_at_date: string;
    balance_usdt?: number | null;
  }>;
  last_30_days_in_out_flow: Array<{
    related_at_date: string;
    today_in_flow?: number | null;
    today_out_flow?: number | null;
  }>;
  last_30_days_pnls: Array<{
    related_at_date: string;
    recent_trading_pnl?: number | null;
  }>;
  recent_trading_pnl_percentage?: number | null;
  recent_trading_realized_pnl_percentage?: number | null;
  recent_trading_pnl?: number | null;
  recent_trading_realized_pnl?: number | null;
  total_recent_transfers?: number | null;
  total_recent_transfer_volume?: number | null;
  last_30_days_balance_change?: number | null;
  last_30_days_balance_change_percentage?: number | null;
  recent_trading_volume?: number | null;
  recent_trading_wins?: number | null;
  recent_trading_losses?: number | null;
  recent_average_trades_per_day?: number | null;
  recent_average_trade_duration_seconds?: number | null;
  recent_number_of_trades?: number | null;
  recent_largest_win?: number | null;
  recent_largest_loss?: number | null;
  trading_assets: Array<{
    label: 'trading';
    amount?: number | null;
    total_recent_buys?: number | null;
    recent_trading_pnl?: number | null;
    total_recent_sells?: number | null;
    total_recent_transfers?: number | null;
    total_recent_buy_volume?: number | null;
    total_recent_sell_volume?: number | null;
    last_30_days_price_change?: number | null;
    recent_trading_realized_pnl?: number | null;
    recent_trading_pnl_percentage?: number | null;
    total_recent_volume_transferred?: number | null;
    recent_avg_trade_duration_seconds?: number | null;
    recent_trading_realized_pnl_percentage?: number | null;
    market_data: {
      id: string;
      ath?: number | null;
      atl?: number | null;
      roi?: number | null;
      low_24h?: number | null;
      ath_date?: string | null;
      atl_date?: string | null;
      high_24h?: number | null;
      market_cap?: number | null;
      max_supply?: number | null;
      last_updated?: string | null;
      total_supply?: number | null;
      total_volume?: number | null;
      current_price?: number | null;
      market_cap_rank?: number | null;
      price_change_24h?: number | null;
      circulating_supply?: number | null;
      ath_change_percentage?: number | null;
      atl_change_percentage?: number | null;
      market_cap_change_24h?: number | null;
      fully_diluted_valuation?: number | null;
      price_change_percentage_24h?: number | null;
      market_cap_change_percentage_24h?: number | null;
    };
    worth?: number | null;
    symbol: Coin;
  }>;
  holding_assets: Array<{
    label:
      | 'holding'
      | 'unloading'
      | 'loading'
      | 'new_investment'
      | 'exit_portfolio'
      | 'dust';
    amount?: number | null;
    total_recent_buys?: number | null;
    recent_trading_pnl?: number | null;
    total_recent_sells?: number | null;
    total_recent_transfers?: number | null;
    total_recent_buy_volume?: number | null;
    total_recent_sell_volume?: number | null;
    last_30_days_price_change?: number | null;
    recent_trading_realized_pnl?: number | null;
    recent_trading_pnl_percentage?: number | null;
    total_recent_volume_transferred?: number | null;
    recent_avg_trade_duration_seconds?: number | null;
    recent_trading_realized_pnl_percentage?: number | null;
    symbol_slug: string;
    market_data: {
      id: string;
      ath?: number | null;
      atl?: number | null;
      roi?: number | null;
      low_24h?: number | null;
      ath_date?: string | null;
      atl_date?: string | null;
      high_24h?: number | null;
      market_cap?: number | null;
      max_supply?: number | null;
      last_updated?: string | null;
      total_supply?: number | null;
      total_volume?: number | null;
      current_price?: number | null;
      market_cap_rank?: number | null;
      price_change_24h?: number | null;
      circulating_supply?: number | null;
      ath_change_percentage?: number | null;
      atl_change_percentage?: number | null;
      market_cap_change_24h?: number | null;
      fully_diluted_valuation?: number | null;
      price_change_percentage_24h?: number | null;
      market_cap_change_percentage_24h?: number | null;
    };
    worth?: number | null;
    symbol: Coin;
  }>;
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

export interface WhaleSentiment {
  hold_percent?: number | null;
  buy_percent?: number | null;
  sell_percent?: number | null;
}
export const useWhaleSentiment = ({ slug }: { slug: string }) =>
  useQuery({
    queryKey: ['whale-sentiment', slug],
    queryFn: () =>
      ofetch<WhaleSentiment>('/delphi/holders/sentiment/', {
        query: {
          slug,
        },
      }),
  });

export interface CoinWhale {
  holder_address: string;
  network_name: string;
  network_icon_url?: string | null;
  asset: {
    label:
      | SingleWhale['holding_assets'][number]['label']
      | SingleWhale['trading_assets'][number]['label'];
    amount?: number | null;
    total_recent_buys?: number | null;
    recent_trading_pnl?: number | null;
    total_recent_sells?: number | null;
    total_recent_transfers?: number | null;
    total_recent_buy_amount?: number | null;
    total_recent_buy_volume?: number | null;
    total_recent_sell_amount?: number | null;
    total_recent_sell_volume?: number | null;
    last_30_days_price_change?: number | null;
    recent_trading_realized_pnl?: number | null;
    recent_trading_pnl_percentage?: number | null;
    total_recent_volume_transferred?: number | null;
    recent_avg_trade_duration_seconds?: number | null;
    recent_trading_realized_pnl_percentage?: number | null;
  };
}

export const useCoinWhales = (filters: {
  slug: string;
  type: 'holders' | 'traders';
  page: number;
  pageSize: number;
  sortBy?: string;
  isAscending?: boolean;
}) =>
  useQuery({
    queryKey: ['whale-coin-traders', JSON.stringify(filters)],
    keepPreviousData: true,
    queryFn: () =>
      ofetch<PageResponse<CoinWhale>>(
        `/delphi/holders/${
          filters.type === 'holders' ? 'holding' : 'trading'
        }-coin/`,
        {
          query: {
            slug: filters.slug,
            page_size: filters.pageSize,
            page: filters.page,
            sorted_by: filters?.sortBy,
            ascending:
              typeof filters?.isAscending === 'boolean'
                ? filters?.isAscending
                  ? 'True'
                  : 'False'
                : undefined,
          },
        },
      ),
  });
