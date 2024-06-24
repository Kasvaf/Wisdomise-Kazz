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

interface SocialRadarMessageTemplate<S, O> {
  social_type: S;
  content: O;
  timestamp: number;
  id: string;
}

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
  thumbnail?: string;
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

export interface SocialRadarTwitterMessage {
  tweet_id: number;
  related_at: string;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
  text: string;
  lang: string;
  media?:
    | string
    | Array<{
        height: number;
        width: number;
        type: 'video' | 'photo';
        url: string;
      }>;
  user: {
    created_at: string;
    id: number;
    is_active: boolean;
    name: string;
    updated_at: string;
    user_id: number;
    username: string;
  };
}
export interface SocialRadarTradingViewIdeasMessage {
  id: number;
  key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  link: string;
  title: string;
  cover_image_link: string;
  author_updated_at: string;
  author_username: string;
  author_avatar_link: string;
  author_page_link: string;
  social_boost_score: number;
  total_comments: number;
  preview_text: string;
  symbol: number;
  timeline_contents: Array<{
    content: string;
    created_at: string;
  }>;
}

export type SocialRadarMessage =
  | SocialRadarMessageTemplate<'telegram', SocialRadarTelegramMessage>
  | SocialRadarMessageTemplate<'reddit', SocialRadarRedditMessage>
  | SocialRadarMessageTemplate<'twitter', SocialRadarTwitterMessage>
  | SocialRadarMessageTemplate<
      'trading_view',
      SocialRadarTradingViewIdeasMessage
    >;

export const useCoinMessages = (symbol: string) =>
  useQuery({
    queryKey: ['coins-social-message', symbol],
    queryFn: async () => {
      const { data } = await axios.get<{
        reddit: null | SocialRadarRedditMessage[];
        telegram: null | SocialRadarTelegramMessage[];
        trading_view_ideas: null | SocialRadarTradingViewIdeasMessage[];
        twitter: null | SocialRadarTwitterMessage[];
      }>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/social-radar/coin-social-messages/?window_hours=24&symbol_name=${symbol}`,
      );
      const response: SocialRadarMessage[] = [
        ...(data.reddit || []).map(
          redditMessage =>
            ({
              id: `reddit:${redditMessage.subreddit}:${redditMessage.post_id}`,
              social_type: 'reddit',
              timestamp: new Date(redditMessage.related_at).getTime(),
              content: redditMessage,
            }) satisfies SocialRadarMessage,
        ),
        ...(data.telegram || []).map(
          telegramMessage =>
            ({
              id: `telegram:${telegramMessage.channel_id}:${telegramMessage.message_id}`,
              social_type: 'telegram',
              timestamp: new Date(telegramMessage.related_at).getTime(),
              content: telegramMessage,
            }) satisfies SocialRadarMessage,
        ),
        ...(data.trading_view_ideas || []).map(
          tradingViewIdeasMessage =>
            ({
              id: `trading_view:${tradingViewIdeasMessage.id}`,
              social_type: 'trading_view',
              timestamp: new Date(tradingViewIdeasMessage.updated_at).getTime(),
              content: tradingViewIdeasMessage,
            }) satisfies SocialRadarMessage,
        ),
        ...(data.twitter || []).map(
          twitterMessage =>
            ({
              id: `twitter:${twitterMessage.tweet_id}`,
              social_type: 'twitter',
              timestamp: new Date(twitterMessage.related_at).getTime(),
              content: twitterMessage,
            }) satisfies SocialRadarMessage,
        ),
      ].sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
      );
      return response;
    },
  });

export interface SocialRadarExchange {
  coin_ranking_rank: number;
  number_of_markets: number;
  price_in_btc: number;
  price_in_usd: number;
  volume_24h: number;
  volume_percentage: number;
  exchange: {
    id: number;
    name: string;
    key: string;
    is_active: boolean;
    icon_url: string;
    updated_at: string;
    created_at: string;
  };
}
export const useCoinAvailableExchanges = (symbol: string) =>
  useQuery({
    queryKey: ['coin-available-exchanges', symbol],
    queryFn: async () => {
      const { data } = await axios.get<SocialRadarExchange[]>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/symbol-exchanges/?symbol_abbreviation=${symbol}`,
      );
      return (data || []).sort((a, b) =>
        a.coin_ranking_rank < b.coin_ranking_rank
          ? -1
          : a.coin_ranking_rank > b.coin_ranking_rank
          ? 1
          : 0,
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
