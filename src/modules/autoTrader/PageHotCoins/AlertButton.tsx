import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxBell } from 'boxicons-quasar';
import Button from 'shared/Button';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { useHasFlag } from 'api';
import Icon from 'shared/Icon';
import { DebugPin } from 'shared/DebugPin';

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
        variant="primary"
        className={clsx('h-10 !py-1 mobile:!px-4', className)}
        contentClassName="flex gap-0"
        onClick={alertActions.openSaveModal}
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
