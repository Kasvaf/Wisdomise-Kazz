import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useHasFlag } from 'api';
import { useAlerts } from 'api/alert';
import { track } from 'config/segment';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import { useAlertActions } from 'modules/account/PageAlerts/components/useAlertActions';
import Button from 'shared/Button';
import { gtmClass } from 'utils/gtmClass';
import { NotifIsSetIcon, NotificationIcon } from './assets';

export default function SetNotification({ className }: { className?: string }) {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();
  const { data, isLoading } = useAlerts('custom:coin_radar_notification');
  const isSubscribed = data?.findIndex(row => row.state === 'ACTIVE') !== -1;

  const alertActions = useAlertActions({
    dataSource: 'custom:coin_radar_notification',
    messengers: isSubscribed ? [] : ['EMAIL'],
  });

  useOnSearchParamDetectedOnce({
    callback: () => alertActions.openSaveModal(),
    active: !isLoading,
    searchParam: 'open-alert',
  });

  if (!hasFlag('/coin-radar/alerts?coinradar')) return null;

  return (
    <>
      <Button
        onClick={async () => {
          track('Click On', {
            place: 'social_radar_notification',
          });
          void alertActions.save();
        }}
        variant="primary"
        className={clsx(
          'h-10 w-auto !py-1 mobile:w-full',
          isSubscribed || isLoading ? '!bg-white/10' : '!bg-white',
          isLoading && 'animate-pulse',
          className,
          gtmClass('set-alert'),
        )}
        contentClassName={clsx(
          'flex gap-1',
          isSubscribed || isLoading ? '!text-white' : '!text-black',
          isLoading && 'opacity-10',
        )}
        loading={alertActions.isSaving}
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
      {alertActions.content}
    </>
  );
}
