import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type PageResponse } from './types/page';
import { type Coin } from './types/shared';

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
    axios.get<RsiOvernessResponse>('delphi/rsi/overness'),
  );

export const useRsiDivergence = () =>
  useQuery(['rsi/divergence'], () =>
    axios.get<RsiDivergenceResponse>('delphi/rsi/divergence'),
  );

/// ////

interface CoinMarketPulseMarketData {
  id: string;
  current_price: number;
  market_cap: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
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
    axios
      .get<PageResponse<IndicatorHeatmap<I>>>(
        `delphi/${filters.indicator}/heatmap/`,
        {
          params: {
            page_size: filters?.pageSize ?? 10,
            page: filters?.page ?? 1,
            resolution: filters.resolution,
          },
        },
      )
      .then(resp => resp.data),
  );

export type IndicatorConfirmationCombination<I extends Indicator> =
  I extends 'rsi'
    ? 'bullish_divergence' | 'bearish_divergence' | 'oversold' | 'overbought'
    :
        | 'bullish_divergence'
        | 'bearish_divergence'
        | 'macd_cross_up'
        | 'macd_cross_down';

interface IndicatorConfirmationCore {
  symbol: Coin;
  data?: null | CoinMarketPulseMarketData;
  divergence_types?: null | Record<
    string,
    {
      type: -1 | 1 | null;
      related_at: string;
    }
  >;
  bearish_divergence_resolutions?: null | string[];
  bullish_divergence_resolutions?: null | string[];
  analysis?: null | string;
}

interface RsiConfirmation extends IndicatorConfirmationCore {
  rsi_values?: null | Record<
    string,
    {
      value: number;
      related_at: string;
    }
  >;
  oversold_resolutions?: null | string[];
  overbought_resolutions?: null | string[];
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
}

export type IndicatorConfirmation<I extends Indicator> = I extends 'rsi'
  ? RsiConfirmation
  : I extends 'macd'
  ? MacdConfirmation
  : IndicatorConfirmationCore;

export const useIndicatorConfirmations = <I extends Indicator>(filters: {
  indicator: I;
  combination: Array<IndicatorConfirmationCombination<I>>;
  page?: number;
  pageSize?: number;
}) =>
  useQuery(['indicator/momentum-confirmation', JSON.stringify(filters)], () =>
    axios
      .get<PageResponse<IndicatorConfirmation<I>>>(
        `delphi/${filters.indicator}/momentum-confirmation/`,
        {
          params: {
            page_size: filters?.pageSize ?? 10,
            page: filters?.page ?? 1,
            ...Object.fromEntries(
              filters.combination.map(comb => [comb, 'True']),
            ),
          },
        },
      )
      .then(resp => resp.data),
  );
