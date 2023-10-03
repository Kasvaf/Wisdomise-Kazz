import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type StrategiesResponse } from './types/strategy';
import { type PageResponse } from './types/page';

export const useStrategiesQuery = () =>
  useQuery(
    ['strategies'],
    async () => {
      const { data } = await axios.get<StrategiesResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/strategy/strategies`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

interface UserSignal {
  key: string;
  strategy_name: string;
  pair_name: string;
}

export const useUserSignalQuery = () =>
  useQuery(
    ['notifySignals'],
    async () => {
      const { data } = await axios.get<PageResponse<UserSignal>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-signals`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

export const useCreateSignalMutation = () => {
  const client = useQueryClient();
  return async (body: { strategy_name: string; pair_name: string }) => {
    const { data } = await axios.post<UserSignal>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-signals`,
      body,
    );
    await client.invalidateQueries(['notifySignals']);
    return data;
  };
};

export const useDeleteSignalMutation = () => {
  const client = useQueryClient();
  return async (key: string) => {
    const { status } = await axios.delete<UserSignal>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-signals/${key}`,
    );
    await client.invalidateQueries(['notifySignals']);
    return status >= 200 && status < 400;
  };
};
