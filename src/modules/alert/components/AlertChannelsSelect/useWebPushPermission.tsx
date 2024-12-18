import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import oneSignal from 'config/oneSignal';

export const useWebPushPermission = () => {
  const { data: hasPermission, refetch } = useQuery({
    queryKey: ['has-web-push-permission'],
    queryFn: () => {
      const status = oneSignal.getPushStatus();
      if (status === 'ok') {
        return oneSignal.requestPush(); // IDK why, but sometimes the user already gave the push access, but onesignal needs poke!
      }
      return status;
    },
    refetchInterval: latestResult => {
      if (latestResult === 'ok') {
        return false;
      }
      return 3000;
    },
  });

  const requestPermission = useCallback(async () => {
    if (hasPermission === 'ok') return;
    await oneSignal.requestPush();
    void refetch();
  }, [hasPermission, refetch]);

  return [hasPermission, requestPermission] as const;
};
