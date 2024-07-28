import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TEMPLE_ORIGIN } from 'config/constants';
import { type PageResponse } from './types/page';

export interface Whale {
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
    queryKey: [
      'whales',
      filters?.page ?? 1,
      filters?.pageSize ?? 10,
      filters?.sortBy,
      filters?.isAscending,
      filters?.networkAbbreviation,
      filters?.holderAddress,
    ],
    keepPreviousData: true,
    queryFn: async () => {
      const { data } = await axios.get<PageResponse<Whale>>(
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
  sortBy?: string;
  isAscending?: boolean;
}) =>
  useQuery({
    queryKey: [
      'whales-coins',
      filters?.page ?? 1,
      filters?.pageSize ?? 10,
      filters?.sortBy,
      filters?.isAscending,
    ],
    keepPreviousData: true,
    queryFn: async () => {
      const { data } = await axios.get<PageResponse<WhaleCoin>>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/holders/top-coins/`,
        {
          params: {
            page_size: filters?.pageSize ?? 10,
            page: filters?.page ?? 1,
            days: 30, // It's static!
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
