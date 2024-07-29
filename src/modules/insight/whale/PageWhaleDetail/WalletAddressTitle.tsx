import useNotification from 'antd/es/notification/useNotification';
import { bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'usehooks-ts';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { shortenAddress } from 'utils/shortenAddress';

export const WalletAddressTitle: FC<{
  address: string;
  className?: string;
}> = ({ className, address }) => {
  const { t } = useTranslation('common');
  const hasShareApi = 'share' in navigator && 'canShare' in navigator;
  const [, copy] = useCopyToClipboard();
  const [notification, notificationContent] = useNotification();
  const share = () => {
    if (
      hasShareApi &&
      navigator.canShare({
        text: address,
      })
    ) {
      return navigator.share({
        text: address,
      });
    } else {
      void copy(address).then(() => {
        notification.success({
          message: t('copied-to-clipboard'),
          className: '[&_.ant-notification-notice-description]:hidden',
        });
        return null;
      });
    }
  };
  return (
    <>
      <div className={clsx('flex items-center gap-4', className)}>
        <h1 className="text-lg font-bold"> {shortenAddress(address)} </h1>
        <Button
          contentClassName="!text-xs"
          onClick={share}
          variant="alternative"
          size="small"
        >
          <Icon name={bxShareAlt} size={16} className="mr-2" />{' '}
          {t('actions.share')}
        </Button>
      </div>
      {notificationContent}
    </>
  );
};
