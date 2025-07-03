import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getJwtToken, useJwtEmail } from 'modules/base/auth/jwt-store';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';

export function saveUserMultiKeyValue(obj: Record<string, string>) {
  return Promise.all(
    Object.entries(obj)
      .filter(([key, value]) => key && value)
      .map(async ([key, value]) => {
        const resp = await ofetch<{ message?: 'ok' }>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
          {
            method: 'post',
            body: { value },
            retry: 3,
          },
        );
        return resp.message === 'ok' ? value : null;
      }),
  );
}

export function useUserStorage<T = string>(key: string) {
  const queryClient = useQueryClient();
  const userEmail: string | null = (useJwtEmail() as string) ?? null;

  const value = useQuery({
    queryKey: ['user-storage', userEmail, key],
    queryFn: async () => {
      try {
        if (!getJwtToken()) return null;
        const resp = await ofetch<{ value: string }>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        );
        if (typeof resp.value !== 'string') return null;
        try {
          const parsed: T = JSON.parse(resp.value);
          return parsed;
        } catch {
          return resp.value as T;
        }
      } catch {
        return null;
      }
    },
  });

  const save = useMutation({
    mutationFn: async (newValue: T) => {
      if (!getJwtToken()) throw new Error('Not logged in');
      const resp = await ofetch<{ message?: 'ok' }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        {
          body: {
            value:
              typeof newValue === 'object'
                ? JSON.stringify(newValue)
                : newValue,
          },
          method: 'post',
        },
      );
      return resp.message === 'ok' ? newValue : null;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        exact: true,
        queryKey: ['user-storage', userEmail, key],
        refetchType: 'all',
      }),
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (!getJwtToken()) throw new Error('Not logged in');
      await ofetch<{ message?: 'ok' }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        {
          method: 'delete',
        },
      );
      return null;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        exact: true,
        queryKey: ['user-storage', userEmail, key],
        refetchType: 'all',
      }),
  });

  useEffect(() => {
    if (!userEmail) {
      void queryClient.invalidateQueries({
        exact: false,
        queryKey: ['user-storage', key],
        refetchType: 'all',
      });
    }
  }, [key, queryClient, userEmail]);

  return {
    isLoading: value.isLoading || save.isPending || remove.isPending,
    value: value.data || null,
    save: save.mutateAsync,
    remove: remove.mutateAsync,
  };
}
