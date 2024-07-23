import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import {
  type FC,
  useState,
  type SVGProps,
  type PropsWithChildren,
  useEffect,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from 'shared/Button';
import {
  useAccountQuery,
  useIsSubscribedToSocialRadarNotification,
  useToggleSubscribeToSocialRadarNotification,
} from 'api';
import { track } from 'config/segment';
import { DrawerModal } from 'shared/DrawerModal';
import ComboBox from 'shared/ComboBox';
import {
  BellIcon,
  DiscordIcon,
  EmailIcon,
  LockIcon,
  NotifIsSetIcon,
  NotifModalIcon,
  NotificationIcon,
  SlackIcon,
  SmsIcon,
  TelegramIcon,
} from './assets';

export default function SetNotification({ className }: { className?: string }) {
  const { t } = useTranslation('social-radar');
  const { data: isSubscribed, isLoading } =
    useIsSubscribedToSocialRadarNotification();
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

const AlertChannelRow: FC<
  PropsWithChildren<{
    className?: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    label: string;
    subtitle?: string;
    lockIcon?: boolean;
  }>
> = ({ className, icon: Icon, label, subtitle, children, lockIcon }) => {
  const { t } = useTranslation('social-radar');
  return (
    <div className={clsx('flex items-center justify-between p-4', className)}>
      <div>
        <label
          className={clsx('flex items-center gap-1', !children && 'opacity-40')}
        >
          <Icon className="size-4" />
          {label}
        </label>
        {subtitle && (
          <div className="text-xs font-light text-white/60">{subtitle}</div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4">
        {lockIcon && (
          <div className="flex size-7 items-center justify-center rounded-full bg-black/20">
            <LockIcon className="size-6 opacity-90" />
          </div>
        )}
        <span>
          {children || (
            <span className="inline-flex h-6 cursor-not-allowed items-center justify-center rounded-full bg-white/10 px-4 text-xxs text-white/70">
              {t('set-notification.modal.soon')}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
const SetNotificationModalContent: FC<{ onDone: () => void }> = ({
  onDone,
}) => {
  const account = useAccountQuery();
  const { t } = useTranslation('social-radar');
  const isSubscribedQuery = useIsSubscribedToSocialRadarNotification();
  const toggleSubscription = useToggleSubscribeToSocialRadarNotification();

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
            <ComboBox
              className="!bg-black/20 !text-white/70"
              options={[t('set-notification.modal.daily')]}
              selectedItem={[t('set-notification.modal.daily')]}
              renderItem={item => <>{item}</>}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-2 pl-2 text-xs font-normal">
            {t('set-notification.modal.alert-channel-section')}
          </h3>
          <div className="relative h-[270px] divide-y divide-white/5 overflow-y-auto rounded-xl bg-black/20 text-white mobile:h-[245px]">
            <AlertChannelRow
              icon={EmailIcon}
              label={t('set-notification.modal.email-alert-input')}
              subtitle={account.data?.email}
            >
              <Controller
                control={alertForm.control}
                name="isSubscribed"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    checked={value}
                    onChange={onChange}
                    loading={isSubscribedQuery.isLoading}
                    className="!duration-0 [&.ant-switch-checked_.ant-switch-inner]:!bg-[#9747FF]"
                  />
                )}
              />
            </AlertChannelRow>
            <AlertChannelRow
              icon={TelegramIcon}
              label={t('set-notification.modal.telegram-alert-input')}
            />
            <AlertChannelRow
              icon={BellIcon}
              label={t('set-notification.modal.browser-alert-input')}
            />
            <AlertChannelRow
              icon={BellIcon}
              label={t('set-notification.modal.push-alert-input')}
            />
            <AlertChannelRow
              icon={DiscordIcon}
              label={t('set-notification.modal.discord-alert-input')}
            />
            <AlertChannelRow
              icon={SlackIcon}
              label={t('set-notification.modal.slack-alert-input')}
            />
            <AlertChannelRow
              icon={SmsIcon}
              label={t('set-notification.modal.sms-alert-input')}
            />
          </div>
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
