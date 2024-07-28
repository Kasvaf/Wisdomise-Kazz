import { bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC, type ReactNode } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import useNotification from 'antd/es/notification/useNotification';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';

export const Copyable: FC<{
  children?: ReactNode;
  className?: string;
  content: string;
}> = ({ children, className, content }) => {
  const { t } = useTranslation('common');
  const [, copy] = useCopyToClipboard();
  const [notification, notificationContent] = useNotification();
  return (
    <>
      <span className={clsx('inline-flex items-center gap-2', className)}>
        <Icon
          name={bxCopy}
          size={16}
          className="cursor-pointer text-white/70 hover:text-white/90"
          onClick={() =>
            copy(content).then(() =>
              notification.success({
                message: t('copied-to-clipboard'),
                className: '[&_.ant-notification-notice-description]:hidden',
              }),
            )
          }
        />
        {children}
      </span>
      {notificationContent}
    </>
  );
};
