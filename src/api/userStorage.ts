import { useEffect, useMemo } from 'react';
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

export function useUserStorage<T = string>(
  key: string,
  config?: { serializer?: 'json' | 'none' },
) {
  const serializer = config?.serializer ?? 'none';

  const queryClient = useQueryClient();
  const userEmail: string | null = (useJwtEmail() as string) ?? null;

  const rawValue = useQuery({
    queryKey: ['user-storage', userEmail, key],
    queryFn: async () => {
      try {
        if (!getJwtToken()) return null;
        const resp = await ofetch<{ value: string }>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        );
        return resp.value;
      } catch {
        return null;
      }
    },
  });

  const rawSave = useMutation({
    mutationFn: async (newValue: string | null) => {
      if (!getJwtToken()) throw new Error('Not logged in');
      const resp = await ofetch<{ message?: 'ok' }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        newValue === null
          ? {
              method: 'delete',
            }
          : {
              body: {
                value: newValue,
              },
              method: 'post',
            },
      );
      return resp.message === 'ok' ? newValue : null;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ['user-storage', key],
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

  return useMemo(() => {
    const isLoading =
      rawValue.isLoading || rawValue.isPending || rawSave.isPending;
    let value: T | null = null;
    try {
      if (serializer === 'none') {
        value = (rawValue.data as T) ?? null;
      } else if (serializer === 'json') {
        value =
          typeof rawValue.data === 'string'
            ? (JSON.parse(rawValue.data) as T)
            : null;
      }
    } catch {
      value = null;
    }
    const save = (newValue: T | null) => {
      let newRawValue: null | string = null;
      if (newValue === null) {
        newRawValue = null;
      } else {
        if (serializer === 'none') {
          newRawValue = newValue as string;
        } else if (serializer === 'json') {
          newRawValue = JSON.stringify(newRawValue);
        }
      }
      return rawSave.mutateAsync(newRawValue);
    };

    return {
      isLoading,
      value,
      save,
    };
  }, [
    rawSave,
    rawValue.data,
    rawValue.isLoading,
    rawValue.isPending,
    serializer,
  ]);
}
