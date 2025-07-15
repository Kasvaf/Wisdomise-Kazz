import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import { useEffect, useMemo, useState } from 'react';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { resolvePageResponseToArray, createSorter, matcher } from 'api/utils';
import { isDebugMode, isMiniApp } from 'utils/version';
import { ofetch } from 'config/ofetch';
import { type PageResponse } from 'api/types/page';
import { type Coin } from 'api/types/shared';
import { useUserStorage } from 'api/userStorage';
import {
  type CoinDetails,
  type RadarsMetcis,
  type Category,
  type CoinLabels,
  type CoinWhale,
  type DetailedCoin,
  type Exchange,
  type Indicator,
  type IndicatorConfirmation,
  type IndicatorConfirmationCombination,
  type IndicatorConfirmationCore,
  type IndicatorHeatmap,
  type IndicatorHeatmapResolution,
  type MacdConfirmation,
  type Network,
  type RedditMessage,
  type RsiConfirmation,
  type SingleWhale,
  type SocialMessage,
  type SocialRadarCoin,
  type SocialRadarInfo,
  type SocialRadarSentiment,
  type TechnicalRadarCoin,
  type TechnicalRadarSentiment,
  type TelegramMessage,
  type TradingViewIdeasMessage,
  type TwitterMessage,
  type WhaleRadarCoin,
  type WhaleRadarSentiment,
  type WhaleShort,
  type WhaleTransaction,
  type CoinRadarCoin,
  type NetworkRadarNCoinDetails,
  type TokenInsight,
  type TwitterAccount,
  type TwitterFollowedAccount,
  type TwitterTweet,
  type TwitterRelatedToken,
} from './types';

export * from './types';

/* Coin Radar */
export const useCoinRadarCoins = (config: { networks?: string[] }) => {
  const [globalNetwork] = useGlobalNetwork();
  return useQuery({
    queryKey: ['coin-radar-coins'],
    queryFn: () =>
      resolvePageResponseToArray<CoinRadarCoin>(
        '/delphi/intelligence/overview/',
        {
          query: {
            page_size: 1200,
          },
        },
      ),
    select: data =>
      data
        .map(row => ({
          ...row,
          _highlighted:
            (row.social_radar_insight?.wise_score ?? 0) >
              MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE ||
            (row.technical_radar_insight?.wise_score ?? 0) >
              MINIMUM_TECHNICAL_RADAR_HIGHLIGHTED_SCORE,
        }))
        .filter(row => {
          if (
            !matcher([
              ...(globalNetwork ? [globalNetwork] : []),
              ...(config.networks ?? []),
            ]).array(row.networks?.map(x => x.network.slug))
          )
            return false;

          /* remove zero pools tokens if config.network contains solana */
          if (config.networks?.includes('solana')) {
            const solana = row.networks?.find(x => x.network.slug === 'solana');
            if (
              solana &&
              solana.symbol_network_type === 'TOKEN' &&
              !solana.pool_count
            )
              return false;
          }

          return true;
        }),
    refetchInterval: 1000 * 30,
    refetchOnMount: true,
  });
};

/* Social Radar */
const MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE = isDebugMode ? 3 : 5.9;

export const useSocialRadarInfo = () =>
  useQuery({
    queryKey: ['social-radar-info', new Date().toDateString()],
    queryFn: async () => {
      const data = await ofetch<SocialRadarInfo>(
        'delphi/social-radar/market-social-signal/?window_hours=24',
      );
      return data;
    },
  });

export const useSocialRadarCoins = (config: {
  sortBy?: string;
  sortOrder?: 'ascending' | 'descending';
  query?: string;
  categories?: string[];
  networks?: string[];
  exchanges?: string[];
  sources?: string[];
  securityLabels?: string[];
  trendLabels?: string[];
}) => {
  const [globalNetwork] = useGlobalNetwork();
  return useQuery({
    queryKey: ['social-radar-coins'],
    queryFn: () =>
      ofetch<SocialRadarCoin[]>('delphi/social-radar/coins-social-signal/', {
        query: {
          window_hours: 24,
        },
      }).then(x => x ?? []),
    select: data =>
      data
        .map(row => ({
          ...row,
          _highlighted:
            (row.wise_score ?? 0) > MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE,
        }))
        .filter(row => {
          if (
            !matcher(config.query).coin(row.symbol) ||
            !matcher(config.categories).array(
              row.symbol.categories?.map(x => x.slug),
            ) ||
            !matcher([
              ...(globalNetwork ? [globalNetwork] : []),
              ...(config.networks ?? []),
            ]).array(row.networks?.map(x => x.network.slug)) ||
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
              a.symbol_market_data.price_change_percentage_24h,
              b.symbol_market_data.price_change_percentage_24h,
            );

          if (config.sortBy === 'market_cap')
            return sorter(
              b.symbol_market_data.market_cap,
              a.symbol_market_data.market_cap,
            );
          return sorter(a.rank, b.rank);
        }),
    refetchInterval: 1000 * 30,
    refetchOnMount: true,
  });
};

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

/* Technical Radar */
const MINIMUM_TECHNICAL_RADAR_HIGHLIGHTED_SCORE = isDebugMode ? 15 : 18;

export const useIndicatorHeatmap = <I extends 'rsi'>(filters: {
  indicator: I;
  resolution: IndicatorHeatmapResolution;
  networks?: string[];
}) =>
  useQuery({
    queryKey: ['indicator-heatmap', filters.indicator, filters.resolution],
    queryFn: () =>
      resolvePageResponseToArray<IndicatorHeatmap<I>>(
        `delphi/${filters.indicator}/heatmap/`,
        {
          query: {
            resolution: filters.resolution,
            page_size: 2000,
            limit: 150,
          },
        },
      ),
    select: data => {
      return data.filter(row => {
        if (
          !matcher(filters.networks).array(
            row.networks?.map(x => x.network.slug),
          )
        )
          return false;
        return true;
      });
    },
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });

export const useIndicatorConfirmations = <I extends Indicator>(filters: {
  indicator: I;
  combination: IndicatorConfirmationCombination[];
  networks?: string[];
}) => {
  const [globalNetwork] = useGlobalNetwork();
  return useQuery({
    queryKey: [
      'indicator-confirmation',
      filters.indicator,
      filters.combination,
    ],
    queryFn: () =>
      resolvePageResponseToArray<
        IndicatorConfirmation<I> & IndicatorConfirmationCore
      >(`delphi/${filters.indicator}/momentum-confirmation/`, {
        query: {
          page_size: 2000,
          limit: 100,
          ...Object.fromEntries(
            filters.combination.map(comb => [
              comb.endsWith('_divergence') ||
              comb.endsWith('_oversold') ||
              comb.endsWith('_overbought')
                ? comb.replace(`${filters.indicator}_`, '')
                : comb,
              'True',
            ]),
          ),
        },
      }),
    select: data => {
      const results = data
        .map(row => {
          // prefix indicaor values and resolutions to match type
          for (const key of [
            'bearish_divergence_resolutions',
            'bullish_divergence_resolutions',
            'macd_divergence_types',
            'oversold_resolutions',
            'overbought_resolutions',
            'cross_up_resolutions',
            'cross_down_resolutions',
            'values',
          ]) {
            if (key in row) {
              const oldKey = key as keyof typeof row;
              const newKey = `${filters.indicator}_${key}` as keyof typeof row;

              row[newKey] = (row[oldKey] ?? row[newKey]) as never;
            }
          }
          return row;
        })
        .filter(row => {
          if (
            !matcher([
              ...(globalNetwork ? [globalNetwork] : []),
              ...(filters.networks ?? []),
            ]).array(row.networks?.map(x => x.network.slug))
          )
            return false;
          return true;
        });
      return {
        ...data,
        results,
      };
    },
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });
};

export const useTechnicalRadarCoins = (config: {
  query?: string;
  categories?: string[];
  networks?: string[];
  sortOrder?: 'ascending' | 'descending';
  sortBy?: string;
}) => {
  const [globalNetwork] = useGlobalNetwork();
  return useQuery({
    queryKey: ['indicators/technical-radar/top-coins'],
    queryFn: () =>
      resolvePageResponseToArray<TechnicalRadarCoin>(
        'delphi/technical-radar/top-coins/',
        {
          query: {
            page_size: 2000,
          },
        },
      ),
    select: data => {
      return data
        .map(row => ({
          ...row,
          _highlighted:
            (row.score ?? 0) > MINIMUM_TECHNICAL_RADAR_HIGHLIGHTED_SCORE,
        }))
        .filter(row => {
          if (
            !matcher(config.query).coin(row.symbol) ||
            !matcher(config.categories).array(
              row.symbol.categories?.map(x => x.slug),
            ) ||
            !matcher([
              ...(globalNetwork ? [globalNetwork] : []),
              ...(config.networks ?? []),
            ]).array(row.networks?.map(x => x.network.slug))
          )
            return false;
          return true;
        })
        .sort((a, b) => {
          const sorter = createSorter(config.sortOrder);
          if (config.sortBy === 'price_change')
            return sorter(
              a.data?.price_change_percentage_24h,
              b.data?.price_change_percentage_24h,
            );

          if (config.sortBy === 'market_cap')
            return sorter(a.data?.market_cap, b.data?.market_cap);
          return sorter(a.rank, b.rank);
        });
    },
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });
};

export const useTechnicalRadarSentiment = ({ slug }: { slug: string }) =>
  useQuery({
    queryKey: ['technical-radar-sentiment', slug],
    queryFn: async () => {
      try {
        const data = await ofetch<
          RsiConfirmation & MacdConfirmation & TechnicalRadarSentiment
        >('delphi/technical-radar/widget/', {
          query: {
            slug,
          },
        });
        if (!data.normalized_score || !data.technical_sentiment) return null;
        return data;
      } catch (error) {
        if (error instanceof FetchError && error.status === 500) {
          return null;
        }
        throw error;
      }
    },
  });

/* Whale Radar */
export const useWhaleRadarWhales = (config: {
  networkNames?: string[]; // TODO ask to convert this to network slug
  query?: string;
}) => {
  const [globalNetwork] = useGlobalNetwork();
  return useQuery({
    queryKey: ['whale-radar-whales'],
    queryFn: async () => {
      const data = await resolvePageResponseToArray<WhaleShort>(
        'delphi/holders/tops/',
        {
          query: {
            page_size: 99,
          },
        },
      );
      return data;
    },
    select: data =>
      data.filter(row => {
        if (
          !matcher([
            ...(globalNetwork ? [globalNetwork] : []),
            ...(config?.networkNames?.map(x => x.toLowerCase()) ?? []),
          ]).array([row.network_name.toLowerCase()]) ||
          !matcher(config?.query).string(row.holder_address)
        )
          return false;
        return true;
      }),
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });
};

export const useWhaleDetails = (filters: {
  holderAddress: string;
  networkName: string;
}) =>
  useQuery({
    queryKey: ['whale-details', JSON.stringify(filters)],
    queryFn: async () => {
      const data = await ofetch<SingleWhale>(
        '/delphi/holders/holder-details/',
        {
          query: {
            holder_address: filters.holderAddress,
            network_name: filters.networkName,
          },
        },
      );
      return data;
    },
  });

export const useWhaleRadarSentiment = ({ slug }: { slug: string }) =>
  useQuery({
    queryKey: ['whale-sentiment', slug],
    queryFn: () =>
      ofetch<WhaleRadarSentiment>('/delphi/holders/sentiment/', {
        query: {
          slug,
        },
      }).then(resp => {
        if (resp.label_percents.length === 0) return null;
        return resp;
      }),
  });

export const useWhaleRadarCoins = (config: {
  sortBy?: string;
  sortOrder?: 'ascending' | 'descending';
  query?: string;
  categories?: string[];
  networks?: string[];
  securityLabels?: string[];
  trendLabels?: string[];
  profitableOnly?: boolean;
  excludeNativeCoins?: boolean;
}) => {
  const [globalNetwork] = useGlobalNetwork();

  return useQuery({
    queryKey: ['whale-radar-coins'],
    queryFn: () =>
      resolvePageResponseToArray<WhaleRadarCoin>('delphi/holders/top-coins/', {
        query: {
          days: 7,
          page_size: 500,
        },
        meta: { auth: false },
      }),
    select: data =>
      data
        .filter(row => {
          if (
            !matcher(config.query).coin(row.symbol) ||
            !matcher(config.categories).array(
              row.symbol.categories?.map(x => x.slug),
            ) ||
            !matcher([
              ...(globalNetwork ? [globalNetwork] : []),
              ...(config.networks ?? []),
            ]).array(row.networks.map(x => x.network.slug)) ||
            !matcher(config.trendLabels).array(row.symbol_labels) ||
            !matcher(config.securityLabels).security(
              row.symbol_security?.data,
            ) ||
            (config.profitableOnly && !row.profitable) ||
            (config.excludeNativeCoins &&
              row.networks.some(x => x.symbol_network_type === 'COIN'))
          )
            return false;
          return true;
        })
        .sort((a, b) => {
          const sorter = createSorter(config.sortOrder);
          if (config.sortBy === 'price_change')
            return sorter(
              a.data?.price_change_percentage_24h ?? 0,
              b.data?.price_change_percentage_24h ?? 0,
            );

          if (config.sortBy === 'market_cap')
            return sorter(a.data?.market_cap ?? 0, b.data?.market_cap ?? 0);

          if (config.sortBy === 'buy')
            return sorter(a.total_buy_volume, b.total_buy_volume);
          if (config.sortBy === 'sell')
            return sorter(a.total_sell_volume, b.total_sell_volume);
          if (config.sortBy === 'transfer')
            return sorter(a.total_transfer_volume, b.total_transfer_volume);
          if (config.sortBy === 'wallet_count')
            return sorter(a.wallet_count, b.wallet_count);
          return sorter(a.rank, b.rank);
        }),
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });
};

export const useCoinWhales = (config: {
  slug: string;
  type?: 'active' | 'holding';
}) =>
  useQuery({
    queryKey: ['coin-whales', config.slug],
    queryFn: () =>
      resolvePageResponseToArray<CoinWhale>('/delphi/holders/with-coin/', {
        query: {
          slug: config.slug,
          page_size: 99,
        },
      }),
    select: data =>
      data.filter(x => {
        if (config.type === 'active' && x.asset.label === 'holding')
          return false;
        if (config.type === 'holding' && x.asset.label !== 'holding')
          return false;
        return true;
      }),
  });

export const useWhaleTransactions = (config: {
  slug?: string;
  holderAddress: string;
  networkName: string;
  pageSize: number;
  // page: number;
}) =>
  useInfiniteQuery({
    queryKey: [
      'whale-transactions',
      config.slug,
      config.holderAddress,
      config.networkName,
      // config.page,
      config.pageSize,
    ],
    queryFn: ({ pageParam = 1 }) =>
      ofetch<PageResponse<WhaleTransaction>>('delphi/holders/transactions/', {
        query: {
          holder_address: config.holderAddress,
          network_name: config.networkName,
          slug: config.slug,
          page_size: config.pageSize,
          page: pageParam,
        },
        meta: { auth: false },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
    },
    refetchInterval: 1000 * 60,
    refetchOnMount: true,
  });

/* Twitter Tracker */
export const useTwitterSuggestedAccounts = () =>
  useQuery({
    queryKey: ['twitter-suggested-accounts'],
    queryFn: () =>
      resolvePageResponseToArray<TwitterAccount>(
        'delphi/stream/twitter-users/',
      ),
  });

export const useTwitterFollowedAccounts = () => {
  const { value, isLoading, isSaving, isFetching, save } = useUserStorage<
    TwitterFollowedAccount[]
  >('followed_twitter_accounts', { serializer: 'json' });

  return useMemo(() => {
    const follow = (acc: TwitterFollowedAccount) => {
      const currentIndex =
        value?.findIndex?.(x => x.user_id === acc.user_id) ?? -1;
      if (currentIndex !== -1) {
        return save([
          ...(value?.slice?.(0, currentIndex) ?? []),
          acc,
          ...(value?.slice?.(currentIndex + 1) ?? []),
        ]);
      }
      return save([...(value ?? []), acc]);
    };
    const unFollow = (acc: TwitterFollowedAccount | true) =>
      save(
        acc === true
          ? []
          : value?.filter?.(x => x.user_id !== acc.user_id) ?? [],
      );

    return {
      isLoading,
      isSaving,
      isFetching,
      follow,
      unFollow,
      value: value ?? [],
    };
  }, [isLoading, isSaving, isFetching, value, save]);
};

export const useStreamTweets = (config: { userIds: string[] }) => {
  const [tweets, setTweets] = useState<TwitterTweet[]>([]);
  const initialStream = useQuery({
    queryKey: ['streamed-tweets', JSON.stringify(config.userIds)],
    queryFn: () =>
      resolvePageResponseToArray<TwitterTweet>('delphi/streamed/tweets/', {
        meta: {
          auth: false,
        },
        query: {
          user_id: config.userIds,
          hours: 24,
        },
      }),
    enabled: config.userIds.length > 0,
    refetchInterval: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  useEffect(() => {
    // TODO: i couldn't make sure how stream works and cannot test it, so i disabled it for now
    // eslint-disable-next-line no-constant-condition
    if (config.userIds.length === 0 || true) return;
    const controller = new AbortController();

    const startStream = async () => {
      try {
        const response = await ofetch('delphi/stream/tweets/', {
          meta: {
            auth: false,
          },
          query: {
            user_id: config.userIds,
          },
          signal: controller.signal,
          responseType: 'stream',
        });

        const reader = response.getReader();
        const decoder = new TextDecoder('utf8');
        if (!reader) throw new Error('No reader available');

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n').filter(Boolean);
          for (const line of lines) {
            try {
              const tweet = JSON.parse(line);
              setTweets(prev => [...prev, tweet]);
            } catch {}
          }
        }
      } catch {}
    };

    void startStream();

    return () => controller.abort(); // cleanup on unmount
  }, [config.userIds]);

  return useMemo(
    () => ({
      ...initialStream,
      data: [
        ...(initialStream.data ?? []).filter(
          x => !tweets.some(y => y.tweet_id === x.tweet_id),
        ),
        ...tweets,
      ],
    }),
    [initialStream, tweets],
  );
};

export const useTweetRelatedTokens = (tweetId?: string) =>
  useQuery({
    queryKey: ['twitter-tweet-related-tokens', tweetId],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () => {
      if (!tweetId) return [];
      return resolvePageResponseToArray<TwitterRelatedToken>(
        'delphi/twitter-tracker/trench-extractor/',
        {
          query: {
            tweet_twitter_id: tweetId,
          },
        },
      );
    },
  });

/* Rest */
export const useNetworks = (config: {
  filter?:
    | 'social-radar-24-hours'
    | 'technical-radar'
    | 'whale-radar'
    | 'coin-radar';
  query?: string;
}) =>
  useQuery({
    queryKey: ['networks', config.filter],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () => {
      const url =
        config?.filter === 'whale-radar'
          ? '/delphi/holders/networks/'
          : '/delphi/market/networks/';
      const needToAttachFilter = url === '/delphi/market/networks/';
      return resolvePageResponseToArray<Network>(url, {
        query: {
          ...(needToAttachFilter && {
            filter: config?.filter,
          }),
          page_size: 200,
        },
      });
    },
    select: data =>
      data.filter(row => {
        if (!matcher(config.query).string(`${row.name}-${row.slug}`))
          return false;
        return true;
      }),
  });

export const useExchanges = (config: {
  filter?: 'social-radar-24-hours' | 'technical-radar';
  query?: string;
}) =>
  useQuery({
    queryKey: ['exchanges', config.filter],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      ofetch<Exchange[]>('/delphi/market/exchanges/', {
        query: {
          filter: config?.filter,
        },
      }),
    select: data =>
      data.filter(row => {
        const query = config.query?.toLowerCase() ?? '';
        if (!!query && !row.name.toLowerCase().includes(query)) return false;
        return true;
      }),
  });

export const useCategories = (config: {
  filter?: 'social-radar-24-hours' | 'technical-radar';
  query?: string;
}) =>
  useQuery({
    queryKey: ['categories', config.filter],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      ofetch<Category[]>('/delphi/symbol-category/search/', {
        query: {
          filter: config.filter,
        },
      }),
    select: data =>
      data.filter(row => {
        const query = config.query?.toLowerCase() ?? '';
        if (!!query && !`${row.name}-${row.slug}`.toLowerCase().includes(query))
          return false;
        return true;
      }),
  });

export const useCoins = (config: {
  query?: string;
  tradableCoinsOnly?: boolean;
}) =>
  useQuery({
    queryKey: ['coins', config.query, config.tradableCoinsOnly],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () =>
      ofetch<Coin[]>('delphi/symbol/search/', {
        query: {
          q: config.query,
          network_name:
            isMiniApp && config.tradableCoinsOnly ? 'ton' : undefined,
          is_trading: config.tradableCoinsOnly ? true : undefined,
          page_size: 50,
        },
      }),
  });

export const useDetailedCoins = (config: {
  query?: string;
  network?: string;
}) => {
  const [globalNetwork] = useGlobalNetwork();
  const network = config.network ?? globalNetwork;
  return useQuery({
    queryKey: ['coinsV2', config.query, network],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () => {
      if (!network) {
        return [];
      }
      return ofetch<DetailedCoin[]>('delphi/market/symbol-advanced-search/', {
        query: {
          q: config.query,
          network_slug: network,
        },
      });
    },
  });
};

export const useCoinLabels = (config: { query?: string }) =>
  useQuery({
    queryKey: ['coin-labels'],
    queryFn: async () => {
      const data = await ofetch<CoinLabels>(
        'delphi/intelligence/symbol-labels/',
      );
      return (
        data ?? {
          security_labels: [],
          trend_labels: [],
        }
      );
    },
    select: data => ({
      trend_labels: data.trend_labels.filter(row =>
        matcher(config.query).string(row),
      ),
      security_labels: data.security_labels.filter(row =>
        matcher(config.query).string(row),
      ),
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useCoinDetails = ({
  slug,
  priceHistoryDays,
}: {
  slug?: string;
  priceHistoryDays?: number;
}) =>
  useQuery({
    queryKey: ['coin-details', slug, priceHistoryDays ?? 1],
    queryFn: () => {
      if (!slug) return null;
      return ofetch<CoinDetails>('delphi/market/token-review/', {
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
      }));
    },
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000,
  });

export const useNCoinDetails = ({ slug }: { slug?: string }) =>
  useQuery({
    queryKey: ['ncoin-details', slug],
    queryFn: () => {
      if (!slug) return null;
      return ofetch<NetworkRadarNCoinDetails>(
        'delphi/market/unified-coin-details/',
        {
          meta: { auth: false },
          query: {
            slug,
          },
        },
      ).catch(() => null);
    },
    select: x => (x?.creation_datetime ? x : null),
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
  });

export const useRadarsMetrics = () =>
  useQuery({
    queryKey: ['radars-metrics'],
    queryFn: () =>
      ofetch<RadarsMetcis>('delphi/intelligence/coin-radar/metrics/'),
    refetchOnMount: true,
    refetchInterval: 30 * 60 * 1000,
  });

export const useTokenInsight = ({
  contractAddress,
}: {
  contractAddress?: string;
}) =>
  useQuery({
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
    queryKey: ['token-insight', contractAddress],
    queryFn: async () => {
      if (!contractAddress) return null;
      try {
        const data = await ofetch<TokenInsight>(
          'delphi/intelligence/new-born/insights/',
          {
            query: {
              contract_address: contractAddress,
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
