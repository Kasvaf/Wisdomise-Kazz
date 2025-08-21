import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';
import { getJwtToken, useJwtEmail } from 'modules/base/auth/jwt-store';
import { useEffect, useMemo } from 'react';

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

  const {
    data,
    isLoading: isValueLoading,
    isPending: isValuePending,
  } = useQuery({
    queryKey: ['user-storage', key],
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
    meta: {
      persist: false,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newValue: string | null) => {
      if (!getJwtToken()) throw new Error('Not logged in');
      try {
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
      } catch {
        return null;
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey.includes('user-storage') &&
          query.queryKey.includes(key),
      }),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!userEmail) {
      void queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey.includes('user-storage') &&
          query.queryKey.includes(key),
      });
    }
  }, [userEmail]);

  return useMemo(() => {
    const isSaving = isPending;
    const isFetching = isValueLoading || isValuePending;
    const isLoading = isSaving || isFetching;
    let value: T | null = null;
    try {
      if (serializer === 'none') {
        value = (data as T) ?? null;
      } else if (serializer === 'json') {
        value = typeof data === 'string' ? (JSON.parse(data) as T) : null;
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
          newRawValue = JSON.stringify(newValue);
        }
      }

      return mutateAsync(newRawValue);
    };

    return {
      isFetching,
      isSaving,
      isLoading,
      value,
      save,
    };
  }, [
    isPending,
    isValueLoading,
    isValuePending,
    serializer,
    data,
    mutateAsync,
  ]);
}
