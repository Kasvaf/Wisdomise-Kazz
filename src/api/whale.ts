import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TEMPLE_ORIGIN } from 'config/constants';
import { type PageResponse } from './types/page';

export interface WhaleShort {
  rank: number;
  balance_usdt: number;
  holder_address: string;
  last_30_days_trading_pnl_percentage: number;
  network_abbreviation: string;
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
  networkAbbreviation?: string;
  holderAddress?: string;
}) =>
  useQuery({
    queryKey: ['whales', JSON.stringify(filters)],
    keepPreviousData: true,
    refetchInterval: 3000,
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
            network_abbreviation: filters?.networkAbbreviation,
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
  total_last_30_days_trading_pnl: number;
  total_transactions: number;
  total_volume: number;
  market_data: {
    current_price: number;
    image: string;
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
    refetchInterval: 3000,
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
  assets_details: Array<{
    amount: number;
    last_30_days_trading_pnl: number;
    last_30_days_trading_pnl_percentage: number;
    last_30_days_trading_realized_pnl: number;
    market_data: {
      id?: string;
      ath?: number | null;
      atl?: number | null;
      roi?: {
        times: number | null;
        currency: string | null;
        percentage: number | null;
      } | null;
      image?: string | null;
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
    } | null;
    symbol_abbreviation: string;
    symbol_name?: string;
    total_last_30_days_transfers?: number;
    total_last_30_days_volume_transferred?: number;
    worth?: number;
  }>;
  holder_address: string;
  last_30_balance_updates: Array<{
    balance_usdt: number;
    related_at_date: string;
  }>;
  last_30_days_trading_pnl: number;
  last_30_days_trading_pnl_percentage: number;
  last_30_days_trading_realized_pnl: number;
  network_abbreviation: string;
  network_icon_url: string;
  network_name: string;
  total_last_30_days_transfers: number;
}
export const useWhaleDetails = (filters: {
  holderAddress: string;
  networkAbbreviation: string;
}) =>
  useQuery({
    queryKey: ['whale-details', JSON.stringify(filters)],
    queryFn: async () => {
      const { data } = await axios.get<SingleWhale>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/holders/holder-details/`,
        {
          params: {
            holder_address: filters.holderAddress,
            network_abbreviation: filters.networkAbbreviation,
          },
        },
      );
      return data;
    },
  });
