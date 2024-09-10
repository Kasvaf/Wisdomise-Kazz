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

export interface RsiHeatmap {
  symbol: Coin;
  rsi_value: number;
  related_at: string;
  divergence_type: -1 | 1 | null;
  data: {
    id: string;
    current_price: number;
    market_cap: number;
    price_change_24h: number;
  };
}

export type RsiHeatmapResolution = '15m' | '30m' | '1h' | '4h' | '1d';

export const useRsiHeatmap = ({
  resolution,
}: {
  resolution: RsiHeatmapResolution;
}) =>
  useQuery(['rsi/heatmap', resolution], () => {
    const recursiveGetPageData = (
      page: number,
      initialList: RsiHeatmap[],
    ): Promise<RsiHeatmap[]> =>
      axios
        .get<PageResponse<RsiHeatmap>>('delphi/rsi/heatmap/', {
          params: {
            page,
            resolution,
          },
        })
        .then(resp => {
          const updatedList = [...initialList, ...resp.data.results];
          if (resp.data.next !== null) {
            return recursiveGetPageData(page + 1, updatedList);
          }
          return updatedList;
        });
    return recursiveGetPageData(1, []);
  });
