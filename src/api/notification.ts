import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type PageResponse } from './types/page';

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

/**
 * ********************** Athena Daily **************************
 */
export const usePredefinedPromptsQuery = () =>
  useQuery(
    ['predefinedPrompts'],
    async () => {
      const { data } = await axios.get(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/predefined-prompts`,
      );
      return data.results as Array<{ key: string; question: string }>;
    },
    { staleTime: Number.POSITIVE_INFINITY },
  );

export const useSuggestedPromptsQuery = () =>
  useQuery(
    ['suggestedPrompts'],
    async () => {
      const { data } = await axios.get(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/suggested-prompts`,
      );
      return data.results as Array<{ key: string; question: string }>;
    },
    { staleTime: Number.POSITIVE_INFINITY },
  );

export type UserPromptsResponse = Array<{
  key: string;
  type: 'CUSTOM';
  question: string;
}>;

export const useUserPromptsQuery = () =>
  useQuery(
    ['userPrompts'],
    async () => {
      const { data } = await axios.get(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-prompts`,
      );
      return data.results as UserPromptsResponse;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

const useClearPrompts = () => {
  const client = useQueryClient();
  return async () =>
    await Promise.all([
      client.invalidateQueries(['userPrompts']),
      client.invalidateQueries(['suggestedPrompts']),
      client.invalidateQueries(['predefinedPrompts']),
    ]);
};

export const useAddUserPromptMutation = () => {
  return useMutation<unknown, unknown, { type: 'CUSTOM'; question: string }>(
    data =>
      axios.post(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-prompts`,
        data,
      ),
    { onSuccess: useClearPrompts() },
  );
};

export const useDeleteUserPromptMutation = () => {
  return useMutation<unknown, unknown, string>(
    key =>
      axios.delete(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/notification/user-prompts/${key}`,
      ),
    { onSuccess: useClearPrompts() },
  );
};
