import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type AssetPairInfo } from 'api/types/investorAssetStructure';
import { type Resolution } from '.';

export interface Candle {
  related_at: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  number_of_trades: number;
}

export const useCandlesQuery = ({
  asset,
  resolution,
  startDateTime,
  endDateTime,
}: {
  asset?: string;
  resolution?: Resolution;
  startDateTime?: string | Date;
  endDateTime?: string | Date;
}) =>
  useQuery(
    ['candles', asset, resolution, startDateTime, endDateTime],
    async () => {
      const { data } = await axios.get<Candle[]>('/delphi/candles', {
        params: {
          asset,
          resolution,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
        },
      });
      return data;
    },
    {
      enabled: Boolean(asset && resolution && startDateTime && endDateTime),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useRecentCandlesQuery = (asset: string | undefined) =>
  useCandlesQuery({
    asset,
    resolution: '1h',
    startDateTime: useMemo(() => {
      const startDateTime = new Date();
      startDateTime.setMonth(startDateTime.getMonth() - 3);
      return startDateTime.toISOString();
    }, []),
    endDateTime: useMemo(() => new Date().toISOString(), []),
  });

// ========================================================================
export interface StrategySpi {
  title: string;
  key: string;
}
export const useStrategySpiQuery = ({
  strategyKey,
}: {
  strategyKey?: string;
}) =>
  useQuery(
    ['strategy-spi', strategyKey],
    async () => {
      if (!strategyKey) return;
      const { data } = await axios.get<StrategySpi[]>(
        `/strategy/strategies/${strategyKey}/spi-list`,
      );
      return data;
    },
    {
      enabled: Boolean(strategyKey),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

// ========================================================================

export interface StrategyPosition {
  actual_position: ActualPosition;
  strategy_position?: TheoreticalPosition | null;
}

export interface TheoreticalPosition {
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

export const useStrategyPositionsQuery = ({
  strategyKey,
  spiKey,
  asset,
}: {
  strategyKey?: string;
  spiKey?: string;
  asset?: string;
}) =>
  useQuery(
    ['strategy-positions', strategyKey, spiKey, asset],
    async () => {
      if (!strategyKey || !spiKey) return;

      const { data } = await axios.get<StrategyPosition[]>(
        `/strategy/strategies/${strategyKey}/spi-position-differences`,
        {
          params: {
            spi_key: spiKey,
            asset,
          },
        },
      );
      return data;
    },
    {
      enabled: Boolean(strategyKey && spiKey),
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
