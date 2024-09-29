import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TEMPLE_ORIGIN } from 'config/constants';
import { type PageResponse } from './types/page';
import { type Coin } from './types/shared';

export interface WhaleShort {
  rank: number;
  balance_usdt: number;
  holder_address: string;
  last_30_days_trading_pnl_percentage: number;
  network_icon_url: string;
  network_name: string;
  total_last_30_days_transfers: number;
  symbol_name: string;
}

export const useWhales = (filters?: {
  page: number;
  pageSize: number;
  sortBy?: string;
  isAscending?: boolean;
  networkName?: string;
  holderAddress?: string;
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
            holder_address: filters?.holderAddress,
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
  total_last_30_days_trading_pnl: number;
  total_transactions: number;
  total_volume: number;
  market_data: {
    current_price: number;
    image?: string | null;
    price_change_24h: number;
    price_change_percentage_24h: number;
  };
}

export const useWhalesCoins = (filters?: {
  page: number;
  pageSize: number;
  days?: number;
  sortBy?: string;
  isAscending?: boolean;
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
            sorted_by: filters?.sortBy,
            ascending:
              typeof filters?.isAscending === 'boolean'
                ? filters?.isAscending
                  ? 'True'
                  : 'False'
                : undefined,
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
