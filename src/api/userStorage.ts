import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsLoggedIn, useJwtEmail } from 'modules/base/auth/jwt-store';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';

const undefinedSymbol = Symbol('undefined');

export function useUserStorage(key: string) {
  const isLoggedIn = useIsLoggedIn();
  const queryClient = useQueryClient();
  const userEmail: string | null = (useJwtEmail() as string) ?? null;
  const [owner, setOwner] = useState<null | string>(null);

  const value = useQuery({
    queryKey: ['user-storage', userEmail, key],
    queryFn: async () => {
      try {
        if (!isLoggedIn) throw new Error('Not logged in');
        const resp = await ofetch<{ value: string }>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        );
        setOwner(userEmail);
        return typeof resp.value === 'string' ? resp.value : null;
      } catch {
        setOwner(null);
        return undefinedSymbol;
      }
    },
    initialData: undefinedSymbol,
  });

  const save = useMutation({
    mutationFn: async (newValue: string) => {
      if (!isLoggedIn) throw new Error('Not logged in');
      const resp = await ofetch<{ message?: 'ok' }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        {
          body: {
            value: newValue,
          },
          method: 'post',
        },
      );
      return resp.message === 'ok' ? newValue : null;
    },
    onSuccess: newValue =>
      queryClient.setQueryData(['user-storage', userEmail, key], newValue),
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn) throw new Error('Not logged in');
      await ofetch<{ message?: 'ok' }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        {
          method: 'delete',
        },
      );
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(['user-storage', userEmail, key], null);
    },
  });

  useEffect(() => {
    setOwner(null);
  }, [userEmail]);

  const isTrusted =
    !value.isLoading &&
    !save.isLoading &&
    !remove.isLoading &&
    !value.isError &&
    value.isFetched &&
    !!userEmail &&
    userEmail === owner &&
    value.data !== undefinedSymbol;

  return {
    isLoading: value.isLoading || save.isLoading || remove.isLoading,
    value: isTrusted ? (value.data as string) ?? null : undefined,
    save: save.mutateAsync,
    remove: remove.mutateAsync,
  };
}
