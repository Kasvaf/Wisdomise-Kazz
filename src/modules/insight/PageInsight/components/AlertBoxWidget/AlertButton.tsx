import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxBell } from 'boxicons-quasar';
import Button from 'shared/Button';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import { gtmClass } from 'utils/gtmClass';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { track } from 'config/segment';
import { useHasFlag } from 'api';
import Icon from 'shared/Icon';
import { DebugPin } from 'shared/DebugPin';

export default function InsightAlertButton({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation('alerts');
  const alertActions = useAlertActions({});
  const hasFlag = useHasFlag();

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
          'h-10 w-full !py-1 mobile:!px-4',
          className,
          gtmClass('set-alert'),
        )}
        contentClassName="flex gap-0"
        onClick={async () => {
          track('Click On', {
            place: 'social_radar_notification',
          });
          void alertActions.openSaveModal();
        }}
        disabled={!hasFlag('/coin-radar/alerts')}
      >
        <DebugPin value="/coin-radar/alerts" />
        <Icon size={20} name={bxBell} className="mr-1" />
        {t('common.set-alert')}
      </Button>
      {alertActions.content}
    </>
  );
}
