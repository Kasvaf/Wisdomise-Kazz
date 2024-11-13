import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useHasFlag } from 'api';
import { track } from 'config/segment';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import Button from 'shared/Button';
import { gtmClass } from 'utils/gtmClass';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { useAlerts } from 'api/alert';

export default function SetCoinRadarAlert({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();
  const { data, isLoading } = useAlerts({
    data_source: 'manual:social_radar_daily_report',
  });

  const isSubscribed = data?.length === 1;

  const alertActions = useAlertActions({
    data_source: 'manual:social_radar_daily_report',
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
        data-id="set-alert"
        variant="primary"
        className={clsx(
          'h-10 w-auto !py-1 mobile:w-full',
          isSubscribed || isLoading ? '!bg-white/10' : '!bg-white',
          isLoading && 'animate-pulse',
          gtmClass('set-alert'),
          className,
        )}
        contentClassName={clsx(
          'flex gap-1',
          isSubscribed || isLoading ? '!text-white' : '!text-black',
          isLoading && 'opacity-10',
        )}
        loading={alertActions.isSaving}
      >
        {isSubscribed || isLoading
          ? t('set-notification.open-modal-btn.set')
          : t('set-notification.open-modal-btn.not-set')}
      </Button>
      {alertActions.content}
    </>
  );
}
