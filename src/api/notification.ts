import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type StrategiesResponse } from './types/strategy';
import { type PageResponse } from './types/page';

export const useStrategiesQuery = () =>
  useQuery(['strategies'], async () => {
    const { data } = await axios.get<StrategiesResponse>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/strategy/strategies`,
    );
    return data;
  });

interface UserSignal {
  key: string;
  strategy_name: string;
  pair_name: string;
}

export const useUserSignalQuery = () =>
  useQuery(['notifySignals'], async () => {
    const { data } = await axios.get<PageResponse<UserSignal>>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-signals`,
    );
    return data;
  });

export const useCreateSignalMutation =
  () => async (body: { strategy_name: string; pair_name: string }) => {
    const { data } = await axios.post<UserSignal>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-signals`,
      body,
    );
    return data;
  };

export const useDeleteSignalMutation = () => async (key: string) => {
  const { status } = await axios.delete<UserSignal>(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-signals/${key}`,
  );
  return status >= 200 && status < 400;
};
