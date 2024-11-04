import useNotification from 'antd/es/notification/useNotification';
import { bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'usehooks-ts';
import { Link } from 'react-router-dom';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { shortenAddress } from 'utils/shortenAddress';

export const Wallet: FC<{
  wallet: {
    address: string;
    network: string;
  };
  mode?: 'link' | 'title';
  className?: string;
}> = ({ className, wallet, mode }) => {
  const { t } = useTranslation('common');
  const [, copyToClipboard] = useCopyToClipboard();
  const [notification, notificationContent] = useNotification();
  const shortAddress = shortenAddress(wallet.address);

  const copy = () => {
    void copyToClipboard(wallet.address).then(() => {
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
        text: wallet.address,
      })
    ) {
      return navigator.share({
        text: wallet.address,
      });
    }
    return copy();
  };

  const avatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${(
    wallet.network + wallet.address
  ).toLowerCase()}`;

  return (
    <>
      {mode === 'title' ? (
        <div className={clsx('flex items-center gap-3', className)}>
          <img
            src={avatar}
            width={48}
            height={48}
            className="size-10 rounded-full"
          />
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
        <Link
          className={clsx(
            'inline-flex w-max items-center gap-2 overflow-hidden rounded-md p-1 pe-2 font-mono',
            'bg-transparent text-v1-content-primary transition-all hover:bg-v1-background-hover hover:text-inherit',
            className,
          )}
          to={`/coin-radar/whale-radar/${wallet.network}/${wallet.address}`}
        >
          <img
            src={avatar}
            width={32}
            height={32}
            className="size-7 rounded-full"
          />
          <span>{shortAddress}</span>
        </Link>
      )}
      {notificationContent}
    </>
  );
};
