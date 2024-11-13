import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import Button from 'shared/Button';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import { gtmClass } from 'utils/gtmClass';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { track } from 'config/segment';
import { ReactComponent as NotificationIcon } from './notification.svg';

export default function InsightAlertButton({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const alertActions = useAlertActions({});

  useOnSearchParamDetectedOnce({
    callback: () => alertActions.openSaveModal(),
    active: true,
    searchParam: 'open-alert',
  });

  return (
    <>
      <Button
        variant="primary"
        className={clsx(
          'h-10 w-full !bg-white !py-1 mobile:w-full',
          className,
          gtmClass('set-alert'),
        )}
        onClick={async () => {
          track('Click On', {
            place: 'social_radar_notification',
          });
          void alertActions.openSaveModal();
        }}
        contentClassName={'flex gap-1 !text-black'}
      >
        <NotificationIcon className="shrink-0" />
        {t('set-notification.open-modal-btn.not-set')}
      </Button>
      {alertActions.content}
    </>
  );
}
