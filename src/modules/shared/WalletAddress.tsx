import useNotification from 'antd/es/notification/useNotification';
import { bxCopy, bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'usehooks-ts';
import { Link } from 'react-router-dom';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { shortenAddress } from 'utils/shortenAddress';

export const WalletAddress: FC<{
  address: string;
  network: string;
  mode?: 'link' | 'title';
  className?: string;
}> = ({ className, address, mode, network }) => {
  const { t } = useTranslation('common');
  const [, copyToClipboard] = useCopyToClipboard();
  const [notification, notificationContent] = useNotification();
  const shortAddress = shortenAddress(address);

  const copy = () => {
    void copyToClipboard(address).then(() => {
      notification.success({
        message: t('copied-to-clipboard'),
        className: '[&_.ant-notification-notice-description]:hidden',
      });
      return null;
    });
  };
  const share = () => {
    if (
      'share' in navigator &&
      'canShare' in navigator &&
      navigator.canShare({
        text: address,
      })
    ) {
      return navigator.share({
        text: address,
      });
    }
    return copy();
  };
  return (
    <>
      {mode === 'title' ? (
        <div className={clsx('flex items-center gap-4', className)}>
          <h1 className="text-lg font-bold"> {shortAddress} </h1>
          <Button
            contentClassName="!text-xs"
            onClick={() => share()}
            variant="alternative"
            size="small"
          >
            <Icon name={bxShareAlt} size={16} className="mr-2" />{' '}
            {t('actions.share')}
          </Button>
        </div>
      ) : (
        <span className={clsx('inline-flex items-center gap-2', className)}>
          <Icon
            name={bxCopy}
            size={16}
            className="cursor-pointer text-white/70 hover:text-white/90"
            onClick={() => copy()}
          />
          <Link
            to={`/insight/whales/${network}/${address}`}
            className="font-mono text-blue-400 hover:text-blue-300"
          >
            {shortAddress}
          </Link>
        </span>
      )}
      {notificationContent}
    </>
  );
};
