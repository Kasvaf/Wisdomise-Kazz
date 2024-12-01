import useNotification from 'antd/es/notification/useNotification';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

export const useShare = (method?: 'copy' | 'share') => {
  const { t } = useTranslation('common');
  const [notification, notificationContent] = useNotification();

  const action = useCallback(
    async (text: string) => {
      if (
        'share' in navigator &&
        'canShare' in navigator &&
        method === 'share'
      ) {
        const canShare = navigator.canShare({
          text,
        });
        if (canShare) {
          await navigator.share({
            text,
          });
          return true;
        }
      }

      if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
          notification.success({
            message: t('copied-to-clipboard'),
            className: '[&_.ant-notification-notice-description]:hidden',
          });
          return true;
        } catch {}
      }

      prompt('', text);
      return true;
    },
    [method, notification, t],
  );

  return useMemo(
    () => [action, notificationContent] as const,
    [notificationContent, action],
  );
};
