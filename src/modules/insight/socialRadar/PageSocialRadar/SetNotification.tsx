import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import {
  useAccountQuery,
  useIsSubscribedToSocialRadarNotification,
  useToggleSubscribeToSocialRadarNotification,
} from 'api';
import { ReactComponent as NotificationIcon } from './images/notification.svg';
import { ReactComponent as NotificationModalIcon } from './images/noti-modal.svg';

export default function SetNotification() {
  useIsSubscribedToSocialRadarNotification();
  const { t } = useTranslation('social-radar');
  const [modal, open] = useModal(SetNotificationModal);

  return (
    <>
      <Button
        onClick={open}
        variant="primary"
        className="h-10 !py-1"
        contentClassName="flex gap-1"
      >
        <NotificationIcon />
        {t('set-notification.open-modal-btn')}
      </Button>
      {modal}
    </>
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
            onChange={() => toggleSubscription.mutate()}
          />
        </div>
      </div>
    </section>
  );
};
