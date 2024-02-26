import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type AssetPairInfo } from 'api/types/investorAssetStructure';

interface FpSubscriber {
  title: string;
  key: string;
}

export const useFpSubscribersQuery = ({ fpKey }: { fpKey?: string }) =>
  useQuery(
    ['fp-subscribers', fpKey],
    async () => {
      if (!fpKey) return;
      const { data } = await axios.get<{ subscribers: FpSubscriber[] }>(
        `/factory/financial-products/${fpKey}/subscribers`,
      );
      return data.subscribers;
    },
    {
      enabled: Boolean(fpKey),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

// ========================================================================

export interface StrategyPosition {
  actual_position: ActualPosition;
  strategy_position?: TheoreticalPosition | null;
}

interface TheoreticalPosition {
  position_side: 'LONG' | 'SHORT';
  entry_time: string;
  entry_price: number;
  exit_time?: string;
  exit_price?: number;
  pnl: number;
}

interface ActualPosition {
  position_side: 'LONG' | 'SHORT';
  amount: number;
  entry_time: string;
  entry_price: number;
  exit_time?: string;
  exit_price?: number;
  pnl: number;
  pair: AssetPairInfo;
}

export const useFpPositionsQuery = ({
  fpKey,
  subscriberKey,
  assetName,
  startTime,
  endTime,
}: {
  fpKey?: string;
  subscriberKey?: string;
  assetName?: string;
  startTime?: string;
  endTime?: string;
}) =>
  useQuery(
    ['fp-positions', fpKey, subscriberKey, assetName, startTime, endTime],
    async () => {
      if (!fpKey || !subscriberKey) return;

      const { data } = await axios.get<StrategyPosition[]>(
        `/factory/financial-products/${fpKey}/position-differences`,
        {
          params: {
            subscriber_key: subscriberKey,
            asset_name: assetName,
            start_time: startTime,
            end_time: endTime,
          },
        },
      );
      return data;
    },
    {
      enabled: Boolean(
        fpKey && subscriberKey && assetName && startTime && endTime,
      ),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
