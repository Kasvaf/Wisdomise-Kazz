import { clsx } from 'clsx';
import { bxBell, bxsBell } from 'boxicons-quasar';
import { type MouseEventHandler } from 'react';
import { type ThinStrategy } from 'api/signaler';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import Spin from 'shared/Spin';
import { trackClick } from 'config/segment';
import useToggleNotification from './SignalingTab/useToggleNotification';
import useEnsureTelegramConnected from './SignalingTab/useEnsureTelegramConnected';

const NotificationButton: React.FC<{
  pairName: string;
  strategy: ThinStrategy;
  size?: 'small' | 'large';
  className?: string;
}> = ({ pairName, strategy, size, className }) => {
  const [ModalTelegramConnected, ensureConnected] =
    useEnsureTelegramConnected();

  const { handler, isSelected, isSubmitting, isLoading } =
    useToggleNotification({
      pairName,
      strategy,
      ensureConnected,
    });

  const clickHandler: MouseEventHandler<any> = async e => {
    e.stopPropagation();
    e.preventDefault();

    trackClick('signalers_list_enable_notification', {
      signaler: strategy.name,
    })();
    await handler();
  };

  return (
    <>
      <Button
        className={clsx(
          '!items-center !justify-center !px-4 mobile:!p-[10px]',
          isSelected && 'bg-gradient-to-bl from-[#615298] to-[#42427B]',
          className,
        )}
        variant="alternative"
        onClick={clickHandler}
        disabled={isSubmitting || isLoading}
        size={size}
      >
        {isSubmitting || isLoading ? (
          <Spin fontSize={24} />
        ) : (
          <Icon name={isSelected ? bxsBell : bxBell} />
        )}
      </Button>
      {ModalTelegramConnected}
    </>
  );
};

export default NotificationButton;
