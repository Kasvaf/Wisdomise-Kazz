import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type MarketTypes } from 'api/types/financialProduct';
import { type PairData } from 'api/types/strategy';
import { type Resolution } from 'api';
import normalizePair from 'api/normalizePair';

interface SignalerListItem {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  assets: PairData[];
  open_positions: number;
  last_week_positions: number;
}

export const useMySignalersQuery = () =>
  useQuery(
    ['signalers'],
    async () => {
      const { data } = await axios.get<SignalerListItem[]>(
        '/factory/strategies',
      );
      return data.map(s => ({
        ...s,
        assets: s.assets.map(normalizePair),
      })) as SignalerListItem[];
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export interface SignalerData {
  key: string;
  is_active: boolean;
  market_name: MarketTypes;
  name: string;
  tags: string[];
  strategy_id: string;
  secret_key: string;
  signal_api_call_example: string;
  assets: PairData[];
  resolution: Resolution;
}

// ======================================================================

interface PerfData {
  positions: number;
  pnl: number;
  max_drawdown: number;
  pnl_timeseries: Array<{
    d: string;
    v: number;
  }>;
}

export const useSignalerPerfQuery = ({
  signalerKey,
  assetName,
  startTime,
  endTime,
}: {
  signalerKey?: string;
  assetName?: string;
  startTime?: string;
  endTime?: string;
}) =>
  useQuery(
    ['signalerPerf', signalerKey, assetName, startTime, endTime],
    async () => {
      if (!signalerKey) throw new Error('unexpected');
      const { data } = await axios.get<PerfData>(
        `/factory/strategies/${signalerKey}/performance`,
        {
          params: {
            asset_name: assetName,
            start_time: startTime,
            end_time: endTime,
          },
        },
      );
      return data;
    },
    {
      enabled: !!signalerKey && !!assetName && !!startTime && !!endTime,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
