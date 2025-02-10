import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useAccountQuery } from './account';

export function useUserStorage(key: string) {
  const queryClient = useQueryClient();
  const { data: account } = useAccountQuery();
  const userEmail = account?.info?.email;
  const [owner, setOwner] = useState<null | string>(null);
  const isLoggedIn = useIsLoggedIn();

  const value = useQuery({
    queryKey: ['user-storage', userEmail, key],
    queryFn: async () => {
      if (!userEmail || !isLoggedIn) {
        return;
      }
      const resp = await ofetch<{ value: string }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
      );
      setOwner(userEmail);
      return typeof resp.value === 'string' ? resp.value : null;
    },
    onError: () => setOwner(null),
    initialData: undefined,
  });

  const save = useMutation({
    mutationFn: async (newValue: string) => {
      if (!isLoggedIn || !userEmail) {
        return null;
      }
      try {
        const resp = await ofetch<{ message?: 'ok' }>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
          {
            body: {
              value: newValue,
            },
            method: 'post',
          },
        );
        return resp.message === 'ok' ? newValue : value.data;
      } catch {
        return value.data;
      }
    },
    onSuccess: newValue =>
      queryClient.setQueryData(['user-storage', userEmail, key], newValue),
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (!userEmail || !isLoggedIn) {
        return null;
      }
      try {
        const resp = await ofetch<{ message?: 'ok' }>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
          {
            method: 'delete',
          },
        );
        return resp.message === 'ok';
      } catch {
        return false;
      }
    },
    onSuccess: newValue => {
      if (newValue) {
        queryClient.setQueryData(['user-storage', userEmail, key], null);
      }
    },
  });

  useEffect(() => {
    setOwner(null);
  }, [isLoggedIn]);

  const isTrusted =
    !value.isLoading &&
    !save.isLoading &&
    !remove.isLoading &&
    !value.isError &&
    value.isFetched &&
    !!userEmail &&
    userEmail === owner &&
    value.data !== undefined &&
    isLoggedIn;

  return {
    isLoading: value.isLoading || save.isLoading || remove.isLoading,
    value: isTrusted ? value.data ?? null : undefined,
    save: save.mutateAsync,
    remove: remove.mutateAsync,
  };
}
