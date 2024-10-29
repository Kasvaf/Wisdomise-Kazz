import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';
import queryClient from 'config/reactQuery';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';

export function useUserStorage(key: string, defaultValue?: string) {
  const isLoggedIn = useIsLoggedIn();

  const storage = isLoggedIn ? 'api' : 'local';
  const localStorageKey = `storage:${key}`;

  useEffect(() => {
    if (!storage) return;
    void queryClient.invalidateQueries({
      queryKey: ['user-storage', key],
    });
  }, [storage, key]);

  const save = useMutation({
    mutationFn: async (newValue: string) => {
      if (storage === 'local') {
        localStorage.setItem(localStorageKey, newValue);
      } else {
        await axios.post(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
          {
            value: newValue,
          },
        );
      }
      await queryClient.invalidateQueries({
        queryKey: ['user-storage', key],
      });
      return newValue;
    },
  });

  const value = useQuery({
    queryKey: ['user-storage', key],
    queryFn: async () => {
      if (storage === 'local') {
        return localStorage.getItem(localStorageKey) ?? defaultValue ?? null;
      }
      const { data } = await axios.get<{ value: string }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
      );
      return data.value ?? defaultValue ?? null;
    },
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: defaultValue,
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (storage === 'local') {
        localStorage.removeItem(localStorageKey);
        return null;
      } else {
        await axios.delete(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        );
      }
      await queryClient.invalidateQueries({
        queryKey: ['user-storage', key],
      });
      return null;
    },
  });

  return {
    isLoading: value.isFetching,
    value: value.data,
    save: save.mutateAsync,
    remove: remove.mutateAsync,
  };
}
