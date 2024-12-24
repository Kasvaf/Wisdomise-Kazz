import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { type PageResponse } from './types/page';
import {
  type NetworkSecurity,
  type Coin,
  type CoinNetwork,
} from './types/shared';

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
  useQuery(['rsi/overness'], () =>
    ofetch<RsiOvernessResponse>('delphi/rsi/overness'),
  );

export const useRsiDivergence = () =>
  useQuery(['rsi/divergence'], () =>
    ofetch<RsiDivergenceResponse>('delphi/rsi/divergence'),
  );

/// ////

interface CoinMarketPulseMarketData {
  id?: string | null;
  current_price?: number | null;
  market_cap?: number | null;
  price_change_24h?: number | null;
  price_change_percentage_24h?: number | null;
}

export type Indicator = 'rsi' | 'macd';

export type IndicatorHeatmap<I extends Indicator> = I extends 'rsi'
  ? {
      symbol: Coin;
      rsi_value: number;
      related_at: string;
      divergence_type: -1 | 1 | null;
      data?: CoinMarketPulseMarketData;
    }
  : never;

export type IndicatorHeatmapResolution = '15m' | '30m' | '1h' | '4h' | '1d';

export const useIndicatorHeatmap = <I extends 'rsi'>(filters: {
  indicator: I;
  resolution: IndicatorHeatmapResolution;
  page?: number;
  pageSize?: number;
}) =>
  useQuery(['indicator/heatmap', JSON.stringify(filters)], () =>
    ofetch<PageResponse<IndicatorHeatmap<I>>>(
      `delphi/${filters.indicator}/heatmap/`,
      {
        query: {
          page_size: filters?.pageSize ?? 10,
          page: filters?.page ?? 1,
          resolution: filters.resolution,
        },
      },
    ),
  );

export type IndicatorConfirmationCombination =
  | 'rsi_bullish_divergence'
  | 'rsi_bearish_divergence'
  | 'rsi_oversold'
  | 'rsi_overbought'
  | 'macd_bullish_divergence'
  | 'macd_bearish_divergence'
  | 'macd_cross_up'
  | 'macd_cross_down';

interface IndicatorConfirmationCore {
  symbol: Coin;
  data?: null | CoinMarketPulseMarketData;
  analysis?: null | string;
  symbol_labels?: null | string[];
  symbol_security?: null | {
    data?: null | NetworkSecurity[];
  };
  networks?: null | CoinNetwork[];
}

interface RsiConfirmation extends IndicatorConfirmationCore {
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

interface MacdConfirmation extends IndicatorConfirmationCore {
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
  page?: number;
  pageSize?: number;
}) =>
  useQuery(['indicator/momentum-confirmation', JSON.stringify(filters)], () =>
    ofetch<PageResponse<IndicatorConfirmation<I>>>(
      `delphi/${filters.indicator}/momentum-confirmation/`,
      {
        query: {
          page_size: filters?.pageSize ?? 10,
          page: filters?.page ?? 1,
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
      },
    ).then(data => {
      const results = data.results.map(row => {
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
    }),
  );

export type TechnicalRadarCoin = IndicatorConfirmation<'macd'> &
  IndicatorConfirmation<'rsi'> & {
    rank: number;
    symbol: Coin;
    data?:
      | null
      | (CoinMarketPulseMarketData & {
          market_cap_category?: string | null;
        });
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
  };

export const useTechnicalRadarTopCoins = () =>
  useQuery(['indicators/technical-radar/top-coins'], () => {
    const getRecursive = async (
      page: number,
      prevList: TechnicalRadarCoin[],
    ) => {
      const newResp = await ofetch<PageResponse<TechnicalRadarCoin>>(
        'delphi/technical-radar/top-coins/',
        {
          query: {
            page,
          },
        },
      );
      const lastValue = [...prevList, ...newResp.results];
      if (newResp.next) {
        return await getRecursive(page + 1, lastValue);
      }
      return lastValue;
    };
    return getRecursive(1, []);
  });
