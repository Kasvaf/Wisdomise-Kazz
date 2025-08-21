import useNotification from 'antd/es/notification/useNotification';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useShare = (method?: 'copy' | 'share') => {
  const { t } = useTranslation('common');
  const [notification, notificationContent] = useNotification();

  const action = useCallback(
    async (data: string | File) => {
      if (typeof data === 'string') {
        if (
          'share' in navigator &&
          'canShare' in navigator &&
          method === 'share'
        ) {
          const canShare = navigator.canShare({
            text: data,
          });
          if (canShare) {
            await navigator.share({
              text: data,
            });
            return true;
          }
        }

        if (
          method === 'copy' &&
          'clipboard' in navigator &&
          'writeText' in navigator.clipboard
        ) {
          try {
            await navigator.clipboard.writeText(data);
            notification.success({
              message: t('copied-to-clipboard'),
              className: '[&_.ant-notification-notice-description]:hidden',
            });
            return true;
          } catch {}
          prompt('', data);
        }
      } else {
        if (
          'share' in navigator &&
          'canShare' in navigator &&
          method === 'share'
        ) {
          const canShare = navigator.canShare({
            files: [data],
          });
          if (canShare) {
            await navigator.share({
              files: [data],
            });
            return true;
          }
        }
      }

      return true;
    },
    [method, notification, t],
  );

  return useMemo(
    () => [action, notificationContent] as const,
    [notificationContent, action],
  );
};
