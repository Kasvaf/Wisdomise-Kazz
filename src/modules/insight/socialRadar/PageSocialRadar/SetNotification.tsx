import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import {
  useAccountQuery,
  useIsSubscribedToSocialRadarNotification,
  useToggleSubscribeToSocialRadarNotification,
} from 'api';
import { track } from 'config/segment';
import { ReactComponent as NotificationIcon } from './images/notification.svg';
import { ReactComponent as NotificationIsSetIcon } from './images/notif-is-set.svg';
import { ReactComponent as NotificationModalIcon } from './images/notif-modal.svg';

export default function SetNotification() {
  const { t } = useTranslation('social-radar');
  const [modal, open] = useModal(SetNotificationModal);
  const { data: isSubscribed } = useIsSubscribedToSocialRadarNotification();

  return (
    <div>
      <Button
        onClick={e => {
          track('Click On', {
            place: 'social_radar_notification',
          });
          void open(e);
        }}
        variant="primary"
        className={clsx('h-10 w-full !py-1', isSubscribed && '!bg-white/10')}
        contentClassName={clsx('flex gap-1', isSubscribed && 'text-white')}
      >
        {isSubscribed ? <NotificationIsSetIcon /> : <NotificationIcon />}
        {isSubscribed
          ? t('set-notification.open-modal-btn.set')
          : t('set-notification.open-modal-btn.not-set')}
      </Button>
      {modal}
    </div>
  );
}

const SetNotificationModal = () => {
  const account = useAccountQuery();
  const { t } = useTranslation('social-radar');
  const isSubscribed = useIsSubscribedToSocialRadarNotification();
  const toggleSubscription = useToggleSubscribeToSocialRadarNotification();

  return (
    <section>
      <section className="mb-6 flex flex-col items-center border-b border-white/5">
        <NotificationModalIcon className="mb-6" />
        <p className="mb-4 text-xl font-medium">
          {t('set-notification.modal.title')}
        </p>
        <p className="mb-6 text-center text-xs text-white/60">
          {t('set-notification.modal.sub-title')}
        </p>
      </section>

      <div className="flex justify-between px-3">
        <p className="font-medium">{t('set-notification.modal.period')}</p>
        <p className="rounded-lg bg-white/5 px-5 py-1 text-xs">
          {t('set-notification.modal.daily')}
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-black/10 p-3">
        <div className="flex justify-between">
          <p className="flex items-center gap-1 font-medium">
            {t('set-notification.modal.email')}
            <span className="rounded-full bg-black/50 px-2 py-1 text-xxs">
              {account.data?.email}
            </span>
          </p>

          <Switch
            checked={isSubscribed.data}
            loading={toggleSubscription.isLoading}
            onChange={value => {
              track('Click On', {
                place: 'social_radar_notification_changed',
                status: value ? 'on' : 'off',
              });
              toggleSubscription.mutate();
            }}
          />
        </div>
      </div>
    </section>
  );
};
