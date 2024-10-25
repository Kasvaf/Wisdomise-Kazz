import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import { track } from 'config/segment';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import { useAlertActions } from 'modules/account/PageAlerts/components/useAlertActions';
import { ProLocker } from 'shared/ProLocker';
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
      <ProLocker mode="badge" className={className}>
        <Button
          onClick={async () => {
            track('Click On', {
              place: 'social_radar_notification',
            });
            void alertActions.openSaveModal();
          }}
          variant="primary"
          className="h-10 w-full !bg-white !py-1 mobile:w-full"
          contentClassName={'flex gap-1 !text-black'}
          data-id="set-alert"
        >
          <NotificationIcon className="shrink-0" />
          {t('set-notification.open-modal-btn.not-set')}
        </Button>
      </ProLocker>
      {alertActions.content}
    </>
  );
}
