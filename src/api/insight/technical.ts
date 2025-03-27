import { useQuery } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import { ofetch } from 'config/ofetch';
import { PERSIST_KEY } from 'config/reactQuery';
import { resolvePageResponseToArray } from '../utils';
import {
  type NetworkSecurity,
  type Coin,
  type CoinNetwork,
  type MiniMarketData,
} from '../types/shared';
import { createSorter, matcher } from './utils';

export interface RsiOvernessRow {
  candle_pair_name: string;
  candle_base_abbreviation: string;
  candle_base_slug?: string | null;
  rsi_value_1d: number | null;
  candle_related_at_1d: string | null;
  rsi_value_4h: number | null;
  candle_related_at_4h: string | null;
  rsi_value_1h: number | null;
  candle_related_at_1h: string | null;
  rsi_value_30m: number | null;
  candle_related_at_30m: string | null;
  rsi_value_15m: number | null;
  candle_related_at_15m: string | null;
  candle_base_name: string;
  price_change: number;
  price_change_percentage: number;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  market_cap_change_24h: number;
  image?: string | null;
}

export interface RsiDivergenceRow {
  candle_pair_name: string;
  candle_base_abbreviation: string;
  candle_base_slug?: string | null;
  candle_related_at: string;
  candle_resolution: string;
  divergence_length: string;
  candle_base_name: string;
  price_change: number;
  price_change_percentage: number;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  market_cap_change_24h: number;
  image?: string | null;
}

export interface RsiOvernessResponse {
  over_bought: RsiOvernessRow[];
  over_sold: RsiOvernessRow[];
}

export interface RsiDivergenceResponse {
  bearish_divergence: RsiDivergenceRow[];
  bullish_divergence: RsiDivergenceRow[];
}
export const useRsiOverness = () =>
  useQuery({
    queryKey: ['rsi-overness'],
    queryFn: () => ofetch<RsiOvernessResponse>('delphi/rsi/overness'),
  });

export const useRsiDivergence = () =>
  useQuery({
    queryKey: ['rsi-divergence'],
    queryFn: () => ofetch<RsiDivergenceResponse>('delphi/rsi/divergence'),
  });

export type Indicator = 'rsi' | 'macd';

export type IndicatorHeatmap<I extends Indicator> = I extends 'rsi'
  ? {
      symbol: Coin;
      rsi_value: number;
      related_at: string;
      divergence_type: -1 | 1 | null;
      data?: null | MiniMarketData;
    }
  : never;

export type IndicatorHeatmapResolution = '15m' | '30m' | '1h' | '4h' | '1d';

export const useIndicatorHeatmap = <I extends 'rsi'>(filters: {
  indicator: I;
  resolution: IndicatorHeatmapResolution;
}) =>
  useQuery({
    queryKey: [
      PERSIST_KEY,
      'indicator-heatmap',
      filters.indicator,
      filters.resolution,
    ],
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
  });

export type IndicatorConfirmationCombination =
  | 'rsi_bullish_divergence'
  | 'rsi_bearish_divergence'
  | 'rsi_oversold'
  | 'rsi_overbought'
  | 'macd_bullish_divergence'
  | 'macd_bearish_divergence'
  | 'macd_cross_up'
  | 'macd_cross_down';

export interface IndicatorConfirmationCore {
  symbol: Coin;
  data?: null | MiniMarketData;
  symbol_labels?: null | string[];
  symbol_security?: null | {
    data?: null | NetworkSecurity[];
  };
  networks?: null | CoinNetwork[];
  analysis?: null | string;
}

export interface RsiConfirmation {
  rsi_values?: null | Record<
    string,
    {
      value: number;
      related_at: string;
    }
  >;
  rsi_oversold_resolutions?: null | string[];
  rsi_overbought_resolutions?: null | string[];
  rsi_divergence_types?: null | Record<
    string,
    {
      type: -1 | 1 | null;
      related_at: string;
    }
  >;
  rsi_bearish_divergence_resolutions?: null | string[];
  rsi_bullish_divergence_resolutions?: null | string[];
}

export interface MacdConfirmation {
  macd_values?: null | Record<
    string,
    {
      value: number;
      related_at: string;
    }
  >;
  macd_cross_up_resolutions?: null | string[];
  macd_cross_down_resolutions?: null | string[];
  macd_divergence_types?: null | Record<
    string,
    {
      type: -1 | 1 | null;
      related_at: string;
    }
  >;
  macd_bearish_divergence_resolutions?: null | string[];
  macd_bullish_divergence_resolutions?: null | string[];
}

export type IndicatorConfirmation<I extends Indicator> = I extends 'rsi'
  ? RsiConfirmation
  : I extends 'macd'
  ? MacdConfirmation
  : IndicatorConfirmationCore;

export type IndicatorDivergenceTypes = Record<
  string,
  {
    type: -1 | 1 | null;
    related_at: string;
  }
>;

export type IndicatorValues = Record<
  string,
  {
    value: number;
    related_at: string;
  }
>;

export const useIndicatorConfirmations = <I extends Indicator>(filters: {
  indicator: I;
  combination: IndicatorConfirmationCombination[];
}) =>
  useQuery({
    queryKey: [
      PERSIST_KEY,
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
      const results = data.map(row => {
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
      });
      return {
        ...data,
        results,
      };
    },
  });

export type TechnicalRadarCoin = IndicatorConfirmation<'macd'> &
  IndicatorConfirmation<'rsi'> & {
    rank: number;
    symbol: Coin;
    data?: null | MiniMarketData;
    networks_slug?: null | string[];
    networks?: null | CoinNetwork[];
    score?: number | null;
    rsi_score?: null | number;
    macd_score?: null | number;
    technical_sentiment: string;
    symbol_security?: null | {
      data?: null | NetworkSecurity[];
    };
    symbol_labels?: null | string[];
    sparkline?: null | {
      prices?: null | Array<{
        related_at: string;
        value: number;
      }>;
    };
  };

export const useTechnicalRadarCoins = (config: {
  query?: string;
  categories?: string[];
  networks?: string[];
  sortOrder?: 'ascending' | 'descending';
  sortBy?: string;
}) =>
  useQuery({
    queryKey: [PERSIST_KEY, 'indicators/technical-radar/top-coins'],
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
        .filter(row => {
          if (
            !matcher(config.query).coin(row.symbol) ||
            !matcher(config.categories).array(
              row.symbol.categories?.map(x => x.slug),
            ) ||
            !matcher(config.networks).array(
              row.networks?.map(x => x.network.slug),
            )
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
  });

export interface TechnicalRadarSentiment {
  macd_cross_normalized_score?: number | null;
  macd_divergence_normalized_score?: number | null;
  macd_score?: number | null;
  normalized_score?: number | null;
  rsi_divergence_normalized_score?: number | null;
  rsi_overness_normalized_score?: number | null;
  rsi_score?: number | null;
  technical_sentiment?: string | null;
  analysis?: null | string;
  sparkline?: null | {
    prices?: null | Array<{
      related_at: string;
      value: number;
    }>;
  };
}
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
        return data;
      } catch (error) {
        if (error instanceof FetchError && error.status === 500) {
          return null;
        }
        throw error;
      }
    },
  });
