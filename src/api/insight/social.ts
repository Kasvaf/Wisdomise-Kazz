import { useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import { ofetch } from 'config/ofetch';
import {
  type MarketData,
  type Coin,
  type NetworkSecurity,
  type CoinNetwork,
} from '../types/shared';
import { createSorter, matcher } from './utils';

export interface SocialRadarInfo {
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

export const useSocialRadarInfo = () =>
  useQuery({
    queryKey: ['social-radar-info'],
    queryFn: async () => {
      const data = await ofetch<SocialRadarInfo>(
        'delphi/social-radar/market-social-signal/?window_hours=24',
      );
      return data;
    },
  });

export interface CoinSignalAnalysis {
  call_time: string;
  updated_at: string;
  signal_length: string;
  current_pnl_percentage: number;
  average_signal: number;
  total_signals: number;
  trigger_price: number;
  current_price: number;
  max_profit_percentage: number;
  max_loss_percentage: number;
  real_pnl_percentage: number;
  max_price: number;
  min_price: number;
  sparkline?: null | {
    prices?: null | number[];
    related_ats?: null | string[];
  };
}

export interface SocialRadarSentiment {
  last_signal_related_at: string;
  first_signal_related_at: string;
  gauge_tag: 'LONG' | 'SHORT' | 'NOT SURE';
  gauge_measure: -1 | 0 | 1;
  long_count: number;
  short_count: number;
  messages_count: number;
  symbol?: Coin;
  signals_analysis?: CoinSignalAnalysis;
  wise_score?: number;
  sources?: null | string[];
}
export interface SocialRadarCoin extends SocialRadarSentiment {
  rank: number;
  symbol_market_data: MarketData;
  symbol: Coin;
  symbol_security?: null | {
    data: NetworkSecurity[];
  };
  signals_analysis: CoinSignalAnalysis;
  symbol_labels?: null | string[];
  networks?: null | CoinNetwork[];
  exchanges_name?: null | string[];
}

export const useSocialRadarCoins = (config: {
  windowHours: number;
  sortBy?: string;
  sortOrder?: 'ascending' | 'descending';
  query?: string;
  categories?: string[];
  networks?: string[];
  exchanges?: string[];
  sources?: string[];
  securityLabels?: string[];
  trendLabels?: string[];
}) =>
  useQuery({
    queryKey: ['social-radar-coins', config.windowHours],
    queryFn: async () => {
      const data = await ofetch<SocialRadarCoin[]>(
        'delphi/social-radar/coins-social-signal/',
        {
          query: {
            window_hours: config.windowHours,
          },
        },
      );
      return data ?? [];
    },
    select: data =>
      data
        .filter(row => {
          if (
            !matcher(config.query).coin(row.symbol) ||
            !matcher(config.categories).array(
              row.symbol.categories?.map(x => x.slug),
            ) ||
            !matcher(config.networks).array(
              row.networks?.map(x => x.network.slug),
            ) ||
            !matcher(config.trendLabels).array(row.symbol_labels) ||
            !matcher(config.exchanges).array(row.exchanges_name) ||
            !matcher(config.sources).array(row.sources) ||
            !matcher(config.securityLabels).security(row.symbol_security?.data)
          )
            return false;
          return true;
        })
        .sort((a, b) => {
          const sorter = createSorter(config.sortOrder);
          if (config.sortBy === 'call_time')
            return sorter(a.last_signal_related_at, b.last_signal_related_at);
          if (config.sortBy === 'price_change')
            return sorter(
              b.symbol_market_data.price_change_percentage_24h,
              a.symbol_market_data.price_change_percentage_24h,
            );

          if (config.sortBy === 'market_cap')
            return sorter(
              b.symbol_market_data.market_cap,
              a.symbol_market_data.market_cap,
            );
          return sorter(a.rank, b.rank);
        }),
    refetchInterval: 30_000,
    keepPreviousData: true,
  });

export const useSocialRadarSentiment = ({ slug }: { slug: string }) =>
  useQuery({
    queryKey: ['social-radar-sentiment', slug],
    queryFn: async () => {
      try {
        const data = await ofetch<SocialRadarSentiment>(
          'delphi/social-radar/widget/',
          {
            query: {
              slug,
            },
          },
        );
        return data;
      } catch (error) {
        if (error instanceof FetchError && error.status === 500) {
          return null;
        }
        throw error;
      }
    },
  });

interface SocialMessageTemplate<S, O> {
  social_type: S;
  content: O;
  timestamp: number;
  id: string;
}

export interface TelegramMessage {
  key: string;
  related_at: string;
  channel_id: number;
  channel_title: string;
  channel_name: string;
  message_id: number;
  message_text: string;
  channel_weight: number;
  participants_count?: number | null;
  views?: number | null;
  forwards?: number | null;
  webpage_url?: string | null;
  photo_url?: string;
  channel_language: string;
}

export interface RedditMessage {
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

export interface TwitterMessage {
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

export interface TradingViewIdeasMessage {
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
  side: 'Short' | 'Long';
  timeline_contents: Array<{
    content: string;
    created_at: string;
  }>;
}

export type SocialMessage =
  | SocialMessageTemplate<'telegram', TelegramMessage>
  | SocialMessageTemplate<'reddit', RedditMessage>
  | SocialMessageTemplate<'twitter', TwitterMessage>
  | SocialMessageTemplate<'trading_view', TradingViewIdeasMessage>;

export const useSocialRadarMessages = ({ slug }: { slug: string }) =>
  useQuery({
    queryKey: ['social-radar-message', slug],
    queryFn: async () => {
      const data = await ofetch<{
        reddit: null | RedditMessage[];
        telegram: null | TelegramMessage[];
        trading_view_ideas: null | TradingViewIdeasMessage[];
        twitter: null | TwitterMessage[];
      }>(
        `delphi/social-radar/coin-social-messages/?window_hours=24&slug=${slug}`,
      );
      const response: SocialMessage[] = [
        ...(data.reddit || []).map(
          redditMessage =>
            ({
              id: `reddit:${redditMessage.subreddit}:${redditMessage.post_id}`,
              social_type: 'reddit',
              timestamp: new Date(redditMessage.related_at).getTime(),
              content: redditMessage,
            }) satisfies SocialMessage,
        ),
        ...(data.telegram || []).map(
          telegramMessage =>
            ({
              id: `telegram:${telegramMessage.channel_id}:${telegramMessage.message_id}`,
              social_type: 'telegram',
              timestamp: new Date(telegramMessage.related_at).getTime(),
              content: telegramMessage,
            }) satisfies SocialMessage,
        ),
        ...(data.trading_view_ideas || []).map(
          tradingViewIdeasMessage =>
            ({
              id: `trading_view:${tradingViewIdeasMessage.id}`,
              social_type: 'trading_view',
              timestamp: new Date(
                tradingViewIdeasMessage.author_updated_at,
              ).getTime(),
              content: tradingViewIdeasMessage,
            }) satisfies SocialMessage,
        ),
        ...(data.twitter || []).map(
          twitterMessage =>
            ({
              id: `twitter:${twitterMessage.tweet_id}`,
              social_type: 'twitter',
              timestamp: new Date(twitterMessage.related_at).getTime(),
              content: twitterMessage,
            }) satisfies SocialMessage,
        ),
      ];
      return response;
    },
  });

export const useSocialRadarSources = () =>
  useQuery({
    queryKey: ['social-radar-sources'],
    queryFn: () =>
      ofetch<{
        signal_sources?: null | Array<{
          name: string;
          value: string;
        }>;
      }>('/delphi/social-radar/signal-sources/').then(
        resp => resp.signal_sources ?? [],
      ),
  });
