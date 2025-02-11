import { bxBell } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import { Button } from 'shared/v1-components/Button';
import { DebugPin } from 'shared/DebugPin';
import Icon from 'shared/Icon';

export default function AlertButton({ className }: { className?: string }) {
  const { t } = useTranslation('alerts');
  const alertActions = useAlertActions({});
  const hasFlag = useHasFlag();

  useOnSearchParamDetectedOnce({
    callback: alertActions.openSaveModal,
    active: true,
    searchParam: 'open-alert',
  });

  return (
    <>
      <Button
        variant="white"
        className={className}
        block
        size="md"
        onClick={alertActions.openSaveModal}
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
