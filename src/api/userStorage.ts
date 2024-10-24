import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import queryClient from 'config/reactQuery';
import { useAccountQuery } from './account';

// TODO use api instead of localStorage!
export function useUserStorage(key: string, defaultValue?: string) {
  const { data: account } = useAccountQuery();

  const saveKey = account?.email ? `${account.email}:${key}` : null;

  useEffect(() => {
    if (!saveKey) return;
    void queryClient.invalidateQueries({
      queryKey: ['user-storage', saveKey],
    });
  }, [saveKey]);

  const save = useMutation({
    mutationFn: async (newValue: string) => {
      if (!saveKey) throw new Error('user is not fetched yet!');
      localStorage.setItem(saveKey, newValue);
      // await axios.post(
      //   `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
      //   {
      //     value: newValue,
      //   },
      // );
      await queryClient.invalidateQueries({
        queryKey: ['user-storage', saveKey],
      });
      return newValue;
    },
  });

  const value = useQuery({
    queryKey: ['user-storage', saveKey],
    enabled: !!saveKey,
    queryFn: async () => {
      if (!saveKey) throw new Error('user is not fetched yet!');
      return localStorage.getItem(saveKey) ?? defaultValue;
      // const { data } = await axios.get<{ value: string }>(
      //   `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
      // );
      // return data.value ?? null;
    },
    placeholderData: defaultValue,
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (!saveKey) throw new Error('user is not fetched yet!');
      localStorage.removeItem(saveKey);
      // await axios.delete(
      //   `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
      // );
      await queryClient.invalidateQueries({
        queryKey: ['user-storage', saveKey],
      });
      return null;
    },
  });

  return {
    isLoading: value.isLoading,
    value: value.data,
    save: save.mutateAsync,
    remove: remove.mutateAsync,
  };
}
