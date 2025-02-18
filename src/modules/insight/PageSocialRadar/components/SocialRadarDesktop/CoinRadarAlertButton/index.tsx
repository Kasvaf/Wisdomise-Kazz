import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useHasFlag, useAlerts } from 'api';
import { track } from 'config/segment';
import { gtmClass } from 'utils/gtmClass';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { Button } from 'shared/v1-components/Button';
import { DebugPin } from 'shared/DebugPin';
import { ReactComponent as GearIcon } from './gear.svg';
import { ReactComponent as ScreenerIcon } from './screener.svg';
import { FirstSetModal } from './FirstSetModal';

export default function CoinRadarAlerButton({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();
  const alerts = useAlerts({
    data_source: 'social_radar',
  });
  const [firstToast, setFirstToast] = useState(false);
  const posibleRelatedAlert = alerts.data?.[0];

  const alertActions = useAlertActions(
    posibleRelatedAlert ?? {
      data_source: 'social_radar',
      messengers: ['EMAIL'],
      conditions: [
        {
          field_name: 'networks',
          operator: 'CONTAINS_OBJECT_EACH',
          threshold: '[]',
        },
        {
          field_name: 'symbol.categories',
          operator: 'CONTAINS_OBJECT_EACH',
          threshold: '[]',
        },
      ],
      params: [],
      config: {},
      state: 'ACTIVE',
    },
    true,
  );

  if (
    !hasFlag('/coin-radar/alerts?social_radar_screener') ||
    !hasFlag('/coin-radar/alerts')
  )
    return null;

  return (
    <>
      <Button
        onClick={async () => {
          track('Click On', {
            place: 'social_radar_notification',
          });
          if (posibleRelatedAlert) {
            void alertActions.openSaveModal();
          } else {
            void alertActions.save(false).then(() => setFirstToast(true));
          }
        }}
        variant={posibleRelatedAlert ? 'white' : 'primary'}
        loading={alerts.isLoading}
        className={clsx('shrink-0', gtmClass('set-alert'), className)}
        disabled={alertActions.isSaving}
        size="md"
      >
        <DebugPin
          title={[
            '/coin-radar/alerts?social_radar_screener',
            '/coin-radar/alerts',
          ]}
          color="orange"
        />
        {posibleRelatedAlert ? <GearIcon /> : <ScreenerIcon />}
        {posibleRelatedAlert ? t('screener.edit') : t('screener.set')}
      </Button>
      <FirstSetModal
        open={firstToast}
        onClose={() => setFirstToast(false)}
        onExpand={() => {
          setFirstToast(false);
          void alertActions.openSaveModal();
        }}
      />
      {alertActions.content}
    </>
  );
}
