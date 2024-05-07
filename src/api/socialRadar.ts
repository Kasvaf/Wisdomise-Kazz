import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN, TEMPLE_ORIGIN } from 'config/constants';
import queryClient from 'config/reactQuery';

interface MarketInfoFromSignals {
  long_count: number;
  short_count: number;
  analyzed_messages: number;
  signal_messages: number;
  gauge_measure: number;
  total_channels: number;
  telegram_radar: {
    long_count: number;
    short_count: number;
    signal_messages: number;
    analyzed_messages: number;
    gauge_tag: string;
    gauge_measure: number;
    total_channels: number;
  };
  reddit_radar: {
    long_count: number;
    short_count: number;
    signal_messages: number;
    analyzed_messages: number;
    gauge_tag: string;
    gauge_measure: number;
    total_channels: number;
  };
  gauge_tag: 'NOT SURE' | 'NEUTRAL' | 'LONG' | 'SHORT';
}

export const useMarketInfoFromSignals = () =>
  useQuery({
    queryKey: ['market-social-signal'],
    queryFn: async () => {
      const { data } = await axios.get<MarketInfoFromSignals>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/social-radar/market-social-signal/?window_hours=24`,
      );
      return data;
    },
  });

export interface CoinSignal {
  rank: number;
  symbol_name: string;
  long_count: number;
  short_count: number;
  messages_count: number;
  gauge_tag: 'LONG' | 'SHORT' | 'Not Sure' | 'Neutral';
  gauge_measure: -1 | 0 | 1;
  price_change?: number;
  price_change_percentage?: number;
  current_price?: number;
  market_cap?: number;
  total_volume?: number;
  circulating_supply?: number;
  image?: string;
  telegram?: {
    long_count: number;
    short_count: number;
    messages_count: number;
    gauge_tag: string;
    gauge_measure: number;
  };
  reddit?: {
    long_count: number;
    short_count: number;
    messages_count: number;
    gauge_tag: string;
    gauge_measure: number;
  };
}

export const useCoinSignals = () =>
  useQuery({
    queryKey: ['coins-social-signal'],
    queryFn: async () => {
      const { data } = await axios.get<CoinSignal[]>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/social-radar/coins-social-signal/?window_hours=24`,
      );
      return data;
    },
  });

export interface SocialRadarTelegramMessage {
  key: string;
  related_at: string;
  channel_id: number;
  channel_title: string;
  channel_name: string;
  message_id: number;
  message_text: string;
  channel_weight: number;
  participants_count: number;
  views: null;
  forwards: null;
  webpage_url: null;
  photo_url?: string;
  channel_language: string;
}

export interface SocialRadarRedditMessage {
  post_id: string;
  subreddit: string;
  author: string;
  title: string;
  text: string;
  related_at: string;
  url: string;
  tag: string;
  ups: number;
  downs: number;
  thumbnail: null;
  shared_link: null;
  score: number;
  num_subscribers: number;
  num_comments: number;
  top_comments: Array<{
    body: string;
    score: number;
    author: string;
    related_at: string;
  }>;
}

export const useCoinMessages = (symbol: string) =>
  useQuery({
    queryKey: ['coins-social-message', symbol],
    queryFn: async () => {
      const {
        data: { reddit, telegram },
      } = await axios.get<{
        reddit: SocialRadarRedditMessage[];
        telegram: SocialRadarTelegramMessage[];
      }>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/social-radar/coin-social-messages/?window_hours=24&symbol_name=${symbol}`,
      );

      return [...reddit, ...telegram].sort((a, b) =>
        a.related_at < b.related_at ? -1 : a.related_at > b.related_at ? 1 : 0,
      );
    },
  });

interface RecommendChannelVariables {
  description: string;
  channel_address: string;
}

export const useRecommendChannelMutation = () =>
  useMutation<unknown, unknown, RecommendChannelVariables>({
    mutationFn: async variables => {
      await axios.post(
        `${TEMPLE_ORIGIN}/api/v1/delphi/social-radar/suggest-channel/`,
        variables,
      );
    },
  });

export const useIsSubscribedToSocialRadarNotification = () =>
  useQuery({
    queryKey: ['is_subscribed_to_radar_notification'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/is_subscribed`,
      );
      return data.is_subscribed as boolean;
    },
  });

export const useToggleSubscribeToSocialRadarNotification = () => {
  const isSubscribed = useIsSubscribedToSocialRadarNotification();
  return useMutation({
    mutationFn: async () => {
      await axios.post(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/radar/${
          isSubscribed.data ? 'unsubscribe' : 'subscribe'
        }`,
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'is_subscribed_to_radar_notification',
      ]);
    },
  });
};
