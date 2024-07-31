import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type FC, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from 'shared/Button';
import {
  useIsSubscribedToCoinNotification,
  useToggleSubscribeToCoinNotification,
} from 'api';
import { track } from 'config/segment';
import { DrawerModal } from 'shared/DrawerModal';
import {
  IntervalSelect,
  AlertChannelsSelect,
} from 'modules/account/PageNotification/AlertsTab/AlertSaveModal';
import {
  BellIcon,
  NotifIsSetIcon,
  NotifModalIcon,
  NotificationIcon,
} from './assets';

export default function SetNotification({ className }: { className?: string }) {
  const { t } = useTranslation('coin-radar');
  const { data: isSubscribed, isLoading } = useIsSubscribedToCoinNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          track('Click On', {
            place: 'social_radar_notification',
          });
          setIsModalOpen(true);
        }}
        variant="primary"
        className={clsx(
          'h-10 w-auto !py-1 mobile:w-full',
          isSubscribed || isLoading ? '!bg-white/10' : '!bg-white',
          isLoading && 'animate-pulse',
          className,
        )}
        contentClassName={clsx(
          'flex gap-1',
          isSubscribed || isLoading ? '!text-white' : '!text-black',
          isLoading && 'opacity-10',
        )}
      >
        {isSubscribed || isLoading ? (
          <NotifIsSetIcon className="shrink-0" />
        ) : (
          <NotificationIcon className="shrink-0" />
        )}
        {isSubscribed || isLoading
          ? t('set-notification.open-modal-btn.set')
          : t('set-notification.open-modal-btn.not-set')}
      </Button>
      <DrawerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <SetNotificationModalContent onDone={() => setIsModalOpen(false)} />
      </DrawerModal>
    </>
  );
}

const SetNotificationModalContent: FC<{ onDone: () => void }> = ({
  onDone,
}) => {
  const { t } = useTranslation('coin-radar');
  const isSubscribedQuery = useIsSubscribedToCoinNotification();
  const toggleSubscription = useToggleSubscribeToCoinNotification();

  const alertForm = useForm<{
    isSubscribed: boolean;
  }>();

  useEffect(() => {
    alertForm.resetField('isSubscribed', {
      defaultValue: isSubscribedQuery.data || false,
      keepDirty: false,
      keepTouched: false,
    });
  }, [alertForm, isSubscribedQuery.data]);

  return (
    <section className="mx-auto w-full max-w-lg mobile:max-h-[calc(100vh-10rem)]">
      <section className="mb-6 flex flex-col items-center border-b border-white/5">
        <NotifModalIcon className="mb-6" />
        <h2 className="mb-1 text-base font-medium">
          {t('set-notification.modal.title')}
        </h2>
        <p className="text-center text-xs font-light leading-relaxed text-white/60">
          {t('set-notification.modal.description')}
        </p>
      </section>

      <form
        className="flex flex-col gap-8"
        onSubmit={alertForm.handleSubmit(data => {
          return toggleSubscription.mutateAsync(data).then(e => {
            track('Click On', {
              place: 'social_radar_notification_changed',
              status: data.isSubscribed ? 'on' : 'off',
            });
            onDone();
            return e;
          });
        })}
      >
        <section>
          <h3 className="mb-2 pl-2 text-xs font-normal">
            {t('set-notification.modal.interval-section')}
          </h3>
          <div>
            <IntervalSelect
              className="block !text-white/70 [&_.ant-select-selector]:!bg-black/20"
              disabled
              value={86_400}
              cooldownMode={false}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-2 pl-2 text-xs font-normal">
            {t('set-notification.modal.alert-channel-section')}
          </h3>
          <Controller
            control={alertForm.control}
            name="isSubscribed"
            render={({ field: { value, onChange } }) => (
              <AlertChannelsSelect
                value={value ? ['EMAIL'] : []}
                onChange={e => onChange(e.includes('EMAIL'))}
                loading={isSubscribedQuery.isLoading}
                className="h-[270px] mobile:h-[245px]"
              />
            )}
          />
        </section>

        <Button
          variant="primary-purple"
          disabled={!alertForm.formState.isDirty}
          loading={alertForm.formState.isSubmitting}
          className="group"
        >
          {t('set-notification.modal.save-button')}
          <BellIcon className="ml-1 size-6 group-disabled:opacity-30" />
        </Button>
      </form>
    </section>
  );
};
