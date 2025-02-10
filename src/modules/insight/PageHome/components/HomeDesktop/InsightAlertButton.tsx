import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxBell } from 'boxicons-quasar';
import { gtmClass } from 'utils/gtmClass';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { track } from 'config/segment';
import { useHasFlag } from 'api';
import Icon from 'shared/Icon';
import { DebugPin } from 'shared/DebugPin';
import { Button } from 'shared/v1-components/Button';

export function InsightAlertButton({ className }: { className?: string }) {
  const { t } = useTranslation('alerts');
  const alertActions = useAlertActions({});
  const hasFlag = useHasFlag();

  return (
    <>
      <Button
        variant="primary"
        className={clsx(className, gtmClass('set-alert'))}
        onClick={async () => {
          track('Click On', {
            place: 'social_radar_notification',
          });
          void alertActions.openSaveModal();
        }}
        disabled={!hasFlag('/coin-radar/alerts')}
      >
        <DebugPin title="/coin-radar/alerts" color="orange" />
        <Icon size={20} name={bxBell} className="mr-1" />
        {t('common.set-alert')}
      </Button>
      {alertActions.content}
    </>
  );
}
