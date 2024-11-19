import useNotification from 'antd/es/notification/useNotification';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'usehooks-ts';
import { useMemo } from 'react';

export const useClipboardCopy = () => {
  const { t } = useTranslation('common');
  const [, copyToClipboard] = useCopyToClipboard();
  const [notification, notificationContent] = useNotification();

  return useMemo(
    () =>
      [
        (content: string) =>
          copyToClipboard(content).then(() => {
            notification.success({
              message: t('copied-to-clipboard'),
              className: '[&_.ant-notification-notice-description]:hidden',
            });
            return null;
          }),
        notificationContent,
      ] as const,
    [notificationContent, copyToClipboard, notification, t],
  );
};
