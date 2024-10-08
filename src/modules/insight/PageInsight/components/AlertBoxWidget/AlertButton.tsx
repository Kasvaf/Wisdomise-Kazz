import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import Button from 'shared/Button';
import { track } from 'config/segment';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import { useAlertActions } from 'modules/account/PageAlerts/components/useAlertActions';
import { ReactComponent as NotificationIcon } from './notification.svg';

export default function InsightAlertButton({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const alertActions = useAlertActions();

  useOnSearchParamDetectedOnce({
    callback: () => alertActions.openSaveModal(),
    active: true,
    searchParam: 'open-alert',
  });

  return (
    <>
      <Button
        onClick={async () => {
          track('Click On', {
            place: 'social_radar_notification',
          });
          void alertActions.openSaveModal();
        }}
        variant="primary"
        className={clsx('h-10 w-auto !bg-white !py-1 mobile:w-full', className)}
        contentClassName={'flex gap-1 !text-black'}
      >
        <NotificationIcon className="shrink-0" />
        {t('set-notification.open-modal-btn.not-set')}
      </Button>
      {alertActions.content}
    </>
  );
}
