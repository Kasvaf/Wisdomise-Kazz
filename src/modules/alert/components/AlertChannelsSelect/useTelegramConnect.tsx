import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccountQuery } from 'api';

export const useTelegramConnect = () => {
  const account = useAccountQuery();
  const telegramAddress = `${
    import.meta.env.VITE_ATHENA_BOT_BASE_URL as string
  }${
    account.data?.telegram_code ? `?start=${account.data.telegram_code}` : ''
  }`;

  const { data: isConnected } = useQuery({
    queryKey: ['is-telegram-connected'],
    queryFn: async () => {
      const newAccount = await account.refetch();
      return !!newAccount.data?.telegram_id;
    },
    refetchInterval: latestResult => {
      if (latestResult === true) {
        return false;
      }
      return 3000;
    },
  });

  const connect = useCallback(() => {
    if (isConnected) return;
    window.open(telegramAddress, '_blank')?.focus();
  }, [isConnected, telegramAddress]);

  return [isConnected, connect] as const;
};
