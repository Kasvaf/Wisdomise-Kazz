import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TEMPLE_ORIGIN } from 'config/constants';
import { type PageResponse } from './types/page';
import { type Coin } from './types/shared';

export interface WhaleShort {
  rank: number;
  holder_address: string;
  network_name: string;
  network_icon_url?: string | null;
  balance_usdt?: number | null;
  last_30_days_transfer_volume?: number | null;
  last_30_days_trading_pnl?: number | null;
  last_30_days_trading_pnl_percentage?: number | null;
  last_30_days_trading_wins?: number | null;
  last_30_days_trading_losses?: number | null;
  last_30_days_total_buys?: number | null;
  last_30_days_total_sells?: number | null;
  last_30_days_in_flow?: number | null;
  last_30_days_out_flow?: number | null;
  last_14_days_number_of_trades?: number | null;
  last_14_days_total_trade_duration_seconds?: number | null;
  total_trading_assets?: number | null;
  total_holding_assets?: number | null;
  top_assets: Array<{
    symbol: Coin;
    amount?: number | null;
    worth?: number | null;
    label?: string | null;
    last_30_days_trading_pnl?: number | null;
    last_30_days_trading_pnl_percentage?: number | null;
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
      const { data } = await axios.get<PageResponse<WhaleShort>>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/holders/tops/`,
        {
          params: {
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
  symbol_abbreviation: string;
  symbol_name: string;
  symbol_slug?: string | null;
  symbol: Coin;
  total_buy_number?: null | number;
  total_buy_volume?: null | number;
  total_holding_volume?: null | number;
  total_last_30_days_trading_pnl?: null | number;
  total_sell_number?: null | number;
  total_sell_volume?: null | number;
  total_transfer_volume?: null | number;
  market_data: {
    circulating_supply?: null | number;
    current_price?: null | number;
    market_cap?: null | number;
    price_change_24h?: null | number;
    price_change_percentage_24h?: null | number;
    total_supply?: null | number;
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
      const { data } = await axios.get<PageResponse<WhaleCoin>>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/holders/top-coins/`,
        {
          params: {
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
        },
      );
      return data;
    },
  });

export interface SingleWhale {
  holder_address: string;
  network_name: string;
  network_icon_url: string;
  last_30_days_trading_realized_pnl_percentage: number;
  last_30_days_trading_pnl: number;
  last_30_days_trading_realized_pnl: number;
  total_last_30_days_transfers: number;
  last_30_days_balance_change: number;
  last_30_days_balance_change_percentage: number;
  last_30_days_transfer_volume: number;
  last_30_days_trading_wins: number;
  last_30_days_trading_losses: number;
  last_14_days_total_trade_duration_seconds: number;
  last_14_days_number_of_trades: number;
  last_14_days_largest_win: number;
  last_14_days_largest_loss: number;
  last_14_days_transfer_volume: number;
  last_30_balance_updates: Array<{
    related_at_date: string;
    balance_usdt: number;
  }>;
  last_30_days_in_out_flow: Array<{
    related_at_date: string;
    today_in_flow: number;
    today_out_flow: number;
  }>;
  last_30_days_pnls: Array<{
    related_at_date: string;
    last_30_days_trading_pnl: number;
  }>;

  trading_assets: Array<{
    label: 'trading';
    amount: number;
    symbol_name: string;
    symbol_abbreviation: string;
    last_30_days_trading_pnl: number;
    last_30_days_price_change: null;
    total_last_30_days_transfers: number;
    last_30_days_trading_realized_pnl: number;
    last_30_days_trading_pnl_percentage: number;
    total_last_30_days_volume_transferred: number;
    last_30_days_avg_trade_duration_seconds: number;
    last_30_days_trading_realized_pnl_percentage: number;
    symbol_slug: null | string;
    market_data: {
      id?: string;
      current_price?: number;
      price_change_percentage_24h?: number;
      market_cap?: number;
      total_volume?: number;
    };
    worth: number;
    symbol: Coin;
  }>;
  holding_assets: Array<{
    label:
      | 'holding'
      | 'unloading'
      | 'loading'
      | 'new_investment'
      | 'exit_portfolio';
    amount: number;
    symbol_name: string;
    symbol_abbreviation: string;
    last_30_days_trading_pnl: number;
    last_30_days_price_change: null;
    total_last_30_days_transfers: number;
    last_30_days_trading_realized_pnl: number;
    last_30_days_trading_pnl_percentage: number;
    total_last_30_days_volume_transferred: number;
    last_30_days_avg_trade_duration_seconds: number;
    last_30_days_trading_realized_pnl_percentage: number;
    symbol_slug: null | string;
    market_data: {
      id?: string;
      current_price?: number;
      price_change_percentage_24h?: number;
      market_cap?: number;
      total_volume?: number;
    };
    worth: number;
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
      const { data } = await axios.get<SingleWhale>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/holders/holder-details/`,
        {
          params: {
            holder_address: filters.holderAddress,
            network_name: filters.networkName,
          },
        },
      );
      return data;
    },
  });
