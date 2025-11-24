import useNotification from 'antd/es/notification/useNotification';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useShare = (method?: 'copy' | 'share') => {
  const { t } = useTranslation('common');
  const [notification, notificationContent] = useNotification();

  const action = useCallback(
    async (data: string | File) => {
      if (
        'share' in navigator &&
        'canShare' in navigator &&
        method === 'share'
      ) {
        const canShare = navigator.canShare({
          text: typeof data === 'string' ? data : undefined,
          files: data instanceof File ? [data] : undefined,
        });
        if (canShare) {
          await navigator.share({
            text: typeof data === 'string' ? data : undefined,
            files: data instanceof File ? [data] : undefined,
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
          if (typeof data === 'string') {
            await navigator.clipboard.writeText(data);
          } else {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': data }),
            ]);
          }
          notification.success({
            message: t('copied-to-clipboard'),
            className: '[&_.ant-notification-notice-description]:hidden',
          });
          return true;
        } catch {}
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
