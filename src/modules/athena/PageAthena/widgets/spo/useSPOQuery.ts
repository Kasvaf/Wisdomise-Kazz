import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_ORIGIN } from 'config/constants';
import { type Risk } from './types';

/**
 * Improve for api:
 * 1. remove zero values
 * 2. return only one insight
 */
export const useSPOQuery = (risk: Risk) =>
  useQuery(
    ['spo', risk],
    async () => {
      const { data } = await axios.get(
        `${API_ORIGIN}/api/v0/delphi/spo/last/?risk_profile=${risk}_risk`,
      );
      return {
        coins: (
          data.insight_result.weights as Array<{
            asset: string;
            weight: number;
          }>
        ).filter(r => r.weight !== 0),
        metrics: data.insight_result.metrics as {
          performance_percentage_max_dd: number;
        },
      };
    },
    { keepPreviousData: true, staleTime: Number.POSITIVE_INFINITY },
  );
