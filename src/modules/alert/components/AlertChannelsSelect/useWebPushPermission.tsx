import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import oneSignal from 'config/oneSignal';

export const useWebPushPermission = () => {
  const { t } = useTranslation('alerts');
  const { data: hasPermission, refetch } = useQuery({
    queryKey: ['has-web-push-permission'],
    queryFn: () => {
      if (oneSignal.hasPermission()) {
        return oneSignal.requestPermission(); // IDK why, but sometimes the user already gave the push access, but onesignal needs poke!
      }
      return false;
    },
    refetchInterval: latestResult => {
      if (latestResult === true) {
        return false;
      }
      return 3000;
    },
  });

  const requestPermission = useCallback(async () => {
    if (hasPermission) return;
    const gotPermission = await oneSignal.requestPermission();
    void refetch();
    if (!gotPermission) {
      alert(t('common.notifications.messangers.web_push_blocked'));
    }
  }, [hasPermission, refetch, t]);

  return [hasPermission, requestPermission] as const;
};
