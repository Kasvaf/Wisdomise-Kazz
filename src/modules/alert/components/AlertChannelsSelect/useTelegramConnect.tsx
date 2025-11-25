import { useQuery } from '@tanstack/react-query';
import { TELEGRAM_BOT_BASE_URL } from 'config/constants';
import { useCallback } from 'react';
import { useAccountQuery } from 'services/rest';

export const useTelegramConnect = () => {
  const account = useAccountQuery();
  const telegramAddress = `${TELEGRAM_BOT_BASE_URL}${
    account.data?.telegram_code
      ? `?startapp=login_${account.data.telegram_code}`
      : ''
  }`;

  const { data: isConnected } = useQuery({
    queryKey: ['is-telegram-connected'],
    queryFn: async () => {
      const newAccount = await account.refetch();
      return !!newAccount.data?.telegram_id;
    },
    refetchInterval: latestResult => {
      if (latestResult.state.data === true) {
        return false;
      }
      return 3000;
    },
    meta: {
      persist: false,
    },
  });

  const connect = useCallback(() => {
    if (isConnected) return;
    window.open(telegramAddress, '_blank')?.focus();
  }, [isConnected, telegramAddress]);

  return [isConnected, connect] as const;
};
