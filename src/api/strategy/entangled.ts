import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FpiPosition } from 'api/types/investorAssetStructure';

interface StrategyHistory {
  ket: string;
  active_positions: FpiPosition[];
  historical_positions: FpiPosition[];
}

export const useCreateStrategyEntangledFPI = () => {
  const queryClient = useQueryClient();
  return useMutation<
    StrategyHistory,
    unknown,
    { strategyKey: string; externalAccount?: string }
  >(async ({ strategyKey, externalAccount }) => {
    const { data } = await axios.post<StrategyHistory>(
      `strategy/strategies/${strategyKey}/create_entangled_fpi`,
      externalAccount && { external_account: externalAccount },
    );
    await queryClient.invalidateQueries(['strategies']);
    await queryClient.invalidateQueries(['strategy', strategyKey]);
    return data;
  });
};

const useStrategyHistoryFullQuery = (strategyKey?: string) =>
  useQuery(
    ['strategyHistoryFull', strategyKey],
    async () => {
      if (!strategyKey) throw new Error('unexpected');
      const { data } = await axios.get<StrategyHistory>(
        `/strategy/strategies/${strategyKey}/entangled_fpi`,
      );
      return data;
    },
    { enabled: strategyKey != null },
  );

export const useStrategyHistoryQuery = ({
  strategyKey,
  start_datatime: start,
  end_datetime: end,
  offset,
  limit,
}: {
  strategyKey?: string;
  start_datatime?: string;
  end_datetime?: string;
  offset?: number;
  limit?: number;
}) => {
  const fullHistory = useStrategyHistoryFullQuery(strategyKey);
  return useQuery<{ position_history: FpiPosition[]; total: number }>(
    ['strategyHistory', fullHistory, strategyKey, start, end, offset, limit],
    async () => {
      const h = fullHistory.data?.historical_positions;
      if (!strategyKey || !h) throw new Error('unexpected');

      if (offset != null && limit != null) {
        return {
          total: h.length,
          position_history: h.slice(offset, offset + limit),
        };
      }

      if (start != null && end != null) {
        return {
          total: h.length,
          position_history: h.filter(
            x =>
              (!x.exit_time || +new Date(x.exit_time) > +new Date(start)) &&
              +new Date(x.entry_time) < +new Date(end),
          ),
        };
      }

      throw new Error('unexpected');
    },
    {
      keepPreviousData: true,
      enabled:
        strategyKey != null &&
        fullHistory.data != null &&
        ((start != null && end != null) || (offset != null && limit != null)),
    },
  );
};
