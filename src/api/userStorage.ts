import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import queryClient from 'config/reactQuery';

export function useUserStorage(key: string, defaultValue?: string) {
  const save = useMutation({
    mutationFn: async (newValue: string) => {
      await axios.post(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
        {
          value: newValue,
        },
      );
      await queryClient.invalidateQueries({
        queryKey: ['user-storage', key],
      });
      return newValue;
    },
  });

  const value = useQuery({
    queryKey: ['user-storage', key],
    queryFn: async () => {
      const { data } = await axios.get<{ value: string }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
      );
      return data.value ?? null;
    },
    placeholderData: defaultValue,
  });

  const remove = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/user-storage/${key}`,
      );
      await queryClient.invalidateQueries({
        queryKey: ['user-storage', key],
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
