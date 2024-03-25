import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_ORIGIN } from 'config/constants';

interface MarketInfoFromTelegramSignals {
  long_count: number;
  short_count: number;
  gauge_measure: number;
  total_channels: number;
  signal_messages: number;
  analyzed_messages: number;
  gauge_tag: 'NOT SURE' | 'NEUTRAL' | 'LONG' | 'SHORT';
}

export const useMarketInfoFromTelegramSignals = () =>
  useQuery({
    queryKey: ['market-telegram-signal'],
    queryFn: async () => {
      const { data } = await axios.get<MarketInfoFromTelegramSignals>(
        `${API_ORIGIN}/api/v0/delphi/telegram-radar/market-telegram-signal/?window_hours=24`,
      );
      return data;
    },
  });

export interface CoinTelegramSignal {
  symbol_name: string;
  long_count: number;
  short_count: number;
  messages_count: number;
  gauge_tag: 'LONG' | 'SHORT';
  gauge_measure: -1 | 0 | 1;
  price_change?: number;
  price_change_percentage?: number;
  current_price?: number;
  image: string;
}

export const useCoinTelegramSignals = () =>
  useQuery({
    queryKey: ['coins-telegram-signal'],
    queryFn: async () => {
      const { data } = await axios.get<CoinTelegramSignal[]>(
        `${API_ORIGIN}/api/v0/delphi/telegram-radar/coins-telegram-signal/?window_hours=24`,
      );
      return data;
    },
  });

export interface CoinTelegramMessage {
  key: string;
  related_at: string;
  channel_id: number;
  channel_name: string;
  message_id: number;
  message_text: string;
  channel_weight: number;
  views: number;
  forwards: number;
  webpage_url: string;
  photo_url?: string;
  channel_language: string;
}

export const useCoinTelegramMessages = (symbol: string) =>
  useQuery<CoinTelegramMessage[]>({
    queryKey: ['coins-telegram-message', symbol],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_ORIGIN}/api/v0/delphi/telegram-radar/coin-telegram-messages/?window_hours=24&symbol_name=${symbol}`,
      );
      return data;
    },
  });
