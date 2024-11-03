import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TEMPLE_ORIGIN } from 'config/constants';
import {
  type MarketData,
  type Coin,
  type NetworkSecurity,
} from './types/shared';

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

export interface CoinSignalAnalysis {
  call_time: string;
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
}
export interface CoinSignal {
  rank: number;
  symbol: Coin;
  symbol_market_data: MarketData;
  symbol_security?: null | {
    data: NetworkSecurity[];
  };
  holders_data?: null | {
    total_buy_volume?: null | number;
    total_buy_number?: null | number;
    total_sell_volume?: null | number;
    total_sell_number?: null | number;
    total_transfer_volume?: null | number;
    total_balance?: null | number;
    total_holding_volume?: null | number;
    total_recent_trading_pnl?: null | number;
  };
  long_count: number;
  short_count: number;
  messages_count: number;
  gauge_tag: 'LONG' | 'SHORT' | 'Not Sure' | 'Neutral';
  gauge_measure: -1 | 0 | 1;
  last_signal_related_at: string;
  first_signal_related_at: string;
  signals_analysis: CoinSignalAnalysis;
}

export const useCoinSignals = (filters?: { windowHours: number }) =>
  useQuery({
    queryKey: ['coins-social-signal', JSON.stringify(filters)],
    queryFn: async () => {
      const { data } = await axios.get<CoinSignal[]>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/social-radar/coins-social-signal/?window_hours=${
          filters?.windowHours ?? 24
        }`,
      );
      return data;
    },
    refetchInterval: 30_000,
    keepPreviousData: true,
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
  participants_count: number;
  views: null;
  forwards: null;
  webpage_url: null;
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

export const useSocialMessages = (slug: string) =>
  useQuery({
    queryKey: ['coins-social-message', slug],
    queryFn: async () => {
      const { data } = await axios.get<{
        reddit: null | RedditMessage[];
        telegram: null | TelegramMessage[];
        trading_view_ideas: null | TradingViewIdeasMessage[];
        twitter: null | TwitterMessage[];
      }>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/social-radar/coin-social-messages/?window_hours=24&slug=${slug}`,
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
      ].sort((a, b) => b.timestamp - a.timestamp);
      return response;
    },
  });

export interface CoinExchange {
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
      const { data } = await axios.get<CoinExchange[]>(
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

export interface CoinNetwork {
  network: {
    id: number;
    name: string;
    abbreviation: string;
    icon_url: string;
  };
  contract_address: string;
  symbol_network_type: string;
}
export interface CoinOverview {
  symbol: Coin;
  related_at: string | null;
  data: null | {
    id: string;
    ath: number;
    atl: number;
    roi: null;
    image: string | null;
    low_24h: number;
    high_24h: number;
    max_price_1_d: number;
    max_price_7_d: number;
    max_price_14_d: number;
    max_price_21_d: number;
    max_price_30_d: number;
    min_price_1_d: number;
    min_price_7_d: number;
    min_price_14_d: number;
    min_price_21_d: number;
    min_price_30_d: number;
    ath_date: string;
    atl_date: string;
    market_cap: number;
    max_supply: number;
    last_updated: string;
    total_supply: number;
    total_volume: number;
    current_price: number;
    market_cap_rank: number;
    price_change_24h: number;
    circulating_supply: number;
    ath_change_percentage: number;
    atl_change_percentage: number;
    market_cap_change_24h: number;
    fully_diluted_valuation: number;
    price_change_percentage_24h: number;
    market_cap_change_percentage_24h: number;
    price_history: Array<{
      related_at_date: string;
      mean_price: number;
    }>;
  };
  exchanges: CoinExchange[];
  networks: CoinNetwork[];
}

export const useCoinOverview = ({
  slug,
  priceHistoryDays,
}: {
  slug: string;
  priceHistoryDays?: number;
}) =>
  useQuery({
    queryKey: ['coin-overview', slug, priceHistoryDays ?? 1],
    queryFn: () =>
      axios
        .get<CoinOverview>('delphi/market/token-review/', {
          params: {
            slug,
            price_history_days: priceHistoryDays ?? 1,
          },
          meta: { auth: false },
        })
        .then(resp => resp.data),
    refetchInterval: 10 * 1000,
  });

export interface TrendingCoin {
  market_cap: string;
  total_volume: string;
  price: number;
  price_change_percentage_24h: number;
  sparkline: string;
  symbol: Coin;
}
export const useTrendingCoins = () =>
  useQuery({
    queryKey: ['trending-coins'],
    queryFn: () =>
      axios
        .get<TrendingCoin[]>('delphi/symbols/trending/')
        .then(resp => resp.data),
  });

export const useCoinList = ({
  q,
  networkName,
}: {
  q?: string;
  networkName?: string;
}) =>
  useQuery({
    queryKey: ['coin-list', q, networkName],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      axios
        .get<Coin[]>('delphi/symbol/search/', {
          params: {
            q: q || undefined,
            network_name: networkName,
          },
        })
        .then(resp => resp.data),
  });

export const useCategories = (query?: string) =>
  useQuery({
    queryKey: ['categories', query],
    queryFn: () =>
      axios
        .get<
          Array<{
            icon_url: string;
            id: number;
            name: string;
          }>
        >('/delphi/symbol-category/search/', {
          params: {
            q: query,
          },
        })
        .then(({ data }) => data),
  });
