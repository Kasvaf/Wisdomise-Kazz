import { useMutation, useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import { isMiniApp } from 'utils/version';
import { ofetch } from 'config/ofetch';
import {
  type MarketData,
  type Coin,
  type NetworkSecurity,
  type CoinNetwork,
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
      const data = await ofetch<MarketInfoFromSignals>(
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
}
export interface CoinSignal extends SocialRadarSentiment {
  rank: number;
  symbol_market_data: MarketData;
  symbol: Coin;
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
  signals_analysis: CoinSignalAnalysis;
  symbol_labels?: null | string[];
  networks?: null | CoinNetwork[];
}

export const useCoinSignals = (
  filters?: {
    windowHours: number;
    sortBy?: string;
    sortOrder?: 'ascending' | 'descending';
    query?: string;
    categories?: string[];
    networks?: string[];
  } & Partial<CoinLabels>,
) =>
  useQuery({
    queryKey: ['coins-social-signal', filters?.windowHours],
    queryFn: async () => {
      const data = await ofetch<CoinSignal[]>(
        'delphi/social-radar/coins-social-signal/',
        {
          query: {
            window_hours: filters?.windowHours ?? 24,
          },
        },
      );
      return data ?? [];
    },
    select: data => {
      return data
        .filter(row => {
          const query = filters?.query?.trim().toLowerCase();
          if (
            query &&
            ![row.symbol.name, row.symbol.abbreviation, row.symbol.slug]
              .filter(x => !!x)
              .join('-')
              .toLowerCase()
              .includes(query)
          )
            return false;

          const categories = filters?.categories ?? [];
          if (
            categories.length > 0 &&
            !row.symbol.categories
              ?.map(x => x.slug)
              .some(x => categories.includes(x))
          )
            return false;

          const networks = filters?.networks ?? [];
          if (
            networks.length > 0 &&
            !row.networks
              ?.map(x => x.network.slug)
              .some(x => networks.includes(x))
          )
            return false;

          const trendLabels = filters?.trend_labels ?? [];
          if (
            trendLabels.length > 0 &&
            !row.symbol_labels?.some(x => trendLabels.includes(x))
          )
            return false;

          const securityLabels = filters?.security_labels ?? [];
          const rowSecurityLabels = [
            ...(row.symbol_security?.data?.every(x => !!x.label.trusted)
              ? ['trusted']
              : []),
            ...(row.symbol_security?.data?.some(x => (x.label.warning ?? 0) > 0)
              ? ['warning']
              : []),
            ...(row.symbol_security?.data?.some(x => (x.label.risk ?? 0) > 0)
              ? ['risk']
              : []),
          ];

          if (
            securityLabels.length > 0 &&
            !rowSecurityLabels.some(x => securityLabels.includes(x))
          )
            return false;

          return true;
        })
        .sort((a, b) => {
          const sortBy = filters?.sortBy;
          const sortOrder = filters?.sortOrder === 'descending' ? -1 : 1;
          if (sortBy === 'call_time') {
            return (
              (new Date(b.signals_analysis.call_time ?? Date.now()).getTime() -
                new Date(
                  a.signals_analysis.call_time ?? Date.now(),
                ).getTime()) *
              sortOrder
            );
          }
          if (sortBy === 'price_change') {
            return (
              ((b.symbol_market_data.price_change_percentage_24h ?? 0) -
                (a.symbol_market_data.price_change_percentage_24h ?? 0)) *
              sortOrder
            );
          }
          if (sortBy === 'pnl') {
            return (
              ((b.signals_analysis.real_pnl_percentage ?? 0) -
                (a.signals_analysis.real_pnl_percentage ?? 0)) *
              sortOrder
            );
          }
          if (sortBy === 'market_cap') {
            return (
              ((b.symbol_market_data.market_cap ?? 0) -
                (a.symbol_market_data.market_cap ?? 0)) *
              sortOrder
            );
          }
          return (a.rank - b.rank) * sortOrder;
        });
    },
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

export interface CoinLabels {
  security_labels: string[];
  trend_labels: string[];
}

export const useCoinLabels = () =>
  useQuery({
    queryKey: ['coin-labels'],
    queryFn: async () => {
      const data = await ofetch<CoinLabels>(
        'delphi/intelligence/symbol-labels/',
      );
      return data ?? [];
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

export const useSocialMessages = (slug: string) =>
  useQuery({
    queryKey: ['coins-social-message', slug],
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
      const data = await ofetch<CoinExchange[]>(
        `delphi/symbol-exchanges/?symbol_abbreviation=${symbol}`,
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
      await ofetch('delphi/social-radar/suggest-channel/', {
        body: variables,
        method: 'post',
      });
    },
  });

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
    volume_change_percentage_24h: number;
    price_history: Array<{
      related_at_date: string;
      mean_price: number;
    }>;
  };
  exchanges: CoinExchange[];
  networks?: null | CoinNetwork[];
  symbol_labels?: null | string[];
  charts?: null | Array<{
    type: 'trading_view' | 'gecko_terminal';
    id: string;
    priority: number;
    url: string;
    embedUrl: string;
  }>;
  security_data?: null | Array<{
    symbol_security: NetworkSecurity;
  }>;
  community_data?: {
    preview_listing?: boolean | null;
    public_notice?: string | null;
    additional_notices?: null | string[];
    description?: string | null;
    links?: {
      chat_url?: string[] | null;
      homepage?: string[] | null;
      repos_url: {
        github?: string[] | null;
        bitbucket?: string[] | null;
      };
      whitepaper?: string | null;
      subreddit_url?: string | null;
      blockchain_site?: string[] | null;
      announcement_url?: string | null;
      facebook_username?: string | null;
      official_forum_url?: string[] | null;
      twitter_screen_name?: string | null;
      telegram_channel_identifier?: string | null;
      bitcointalk_thread_identifier?: string | null;
    };
    country_origin?: string | null;
    sentiment_votes_up_percentage?: number | null;
    sentiment_votes_down_percentage?: number | null;
    watchlist_portfolio_users?: number | null;
    community_data?: {
      facebook_likes?: number | null;
      twitter_followers?: number | null;
      reddit_subscribers?: number | null;
      reddit_average_posts_48h?: number | null;
      reddit_accounts_active_48h?: number | null;
      reddit_average_comments_48h?: number | null;
      telegram_channel_user_count?: number | null;
    };
    developer_data?: {
      forks?: number | null;
      stars?: number | null;
      subscribers?: number | null;
      total_issues?: number | null;
      closed_issues?: number | null;
      commit_count_4_weeks?: number | null;
      pull_requests_merged?: number | null;
      pull_request_contributors?: number | null;
      code_additions_deletions_4_weeks: {
        additions?: number | null;
        deletions?: number | null;
      };
      last_4_weeks_commit_activity_series: [];
    };
  };
}

export const useCoinOverview = ({
  slug,
  priceHistoryDays,
}: {
  slug?: string;
  priceHistoryDays?: number;
}) =>
  useQuery({
    queryKey: ['coin-overview', slug, priceHistoryDays ?? 1],
    queryFn: () =>
      ofetch<CoinOverview>('delphi/market/token-review/', {
        query: {
          slug,
          price_history_days: priceHistoryDays ?? 1,
        },
        meta: { auth: false },
      }).then(resp => ({
        ...resp,
        charts: (resp.charts ?? [])?.map(chart => ({
          ...chart,
          url:
            chart.type === 'trading_view'
              ? `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(
                  chart.id,
                )}`
              : chart.type === 'gecko_terminal'
              ? `https://www.geckoterminal.com/${chart.id}`
              : '',
          embedUrl:
            chart.type === 'gecko_terminal'
              ? `https://www.geckoterminal.com/${chart.id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`
              : '',
        })),
      })),
    refetchInterval: 10 * 1000,
    enabled: !!slug,
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
    queryFn: () => ofetch<TrendingCoin[]>('delphi/symbols/trending/'),
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
      ofetch<Coin[]>('delphi/symbol/search/', {
        query: {
          q: q || undefined,
          network_name: networkName ?? (isMiniApp ? 'ton' : undefined),
          exchange_name: isMiniApp ? 'STONFI' : undefined,
          page_size: 200,
        },
      }),
  });

export const useCategories = (config: {
  query?: string;
  filter?: 'social-radar-24-hours' | 'technical-radar';
}) =>
  useQuery({
    queryKey: ['categories', JSON.stringify(config)],
    queryFn: () =>
      ofetch<
        Array<{
          name: string;
          slug: string;
        }>
      >('/delphi/symbol-category/search/', {
        query: {
          q: config.query,
          filter: config.filter,
        },
      }),
  });

export const useNetworks = (config?: {
  filter?: 'social-radar-24-hours' | 'technical-radar';
}) =>
  useQuery({
    queryKey: ['networks', JSON.stringify(config)],
    queryFn: () =>
      ofetch<
        Array<{
          icon_url: string;
          id: number;
          name: string;
          slug: string;
        }>
      >('/delphi/market/networks/', {
        query: {
          filter: config?.filter,
        },
      }),
  });
