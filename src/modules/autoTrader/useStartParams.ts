import { useMemo } from 'react';
import { isLocal } from 'utils/version';
import { useTelegram } from '../base/mini-app/TelegramProvider';

const useStartParams = () => {
  const { webApp } = useTelegram();
  return useMemo(() => {
    const initData = isLocal
      ? import.meta.env.VITE_CUSTOM_QUERY
      : webApp?.initData;
    const startParam = new URLSearchParams(initData).get('start_param');
    return startParam?.split('_') ?? [];
  }, [webApp?.initData]);
};

export default useStartParams;
