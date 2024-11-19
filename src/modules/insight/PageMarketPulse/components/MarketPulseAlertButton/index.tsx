import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useHasFlag } from 'api';
import { track } from 'config/segment';
import { gtmClass } from 'utils/gtmClass';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { useAlerts } from 'api/alert';
import Badge from 'shared/Badge';
import { ReactComponent as GearIcon } from './gear.svg';
import { ReactComponent as ScreenerIcon } from './screener.svg';
import { FirstSetModal } from './FirstSetModal';

export default function MarketPulseAlertButton({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation('market-pulse');
  const hasFlag = useHasFlag();
  const alerts = useAlerts({
    data_source: 'technical_radar',
  });
  const [firstToast, setFirstToast] = useState(false);
  const posibleRelatedAlert = alerts.data?.[0];

  const alertActions = useAlertActions(
    posibleRelatedAlert ?? {
      data_source: 'technical_radar',
      messengers: ['EMAIL'],
      conditions: [
        {
          field_name: 'networks_slug',
          operator: 'CONTAINS_EACH',
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
    !hasFlag('/coin-radar/alerts?technical_radar_screener') ||
    !hasFlag('/coin-radar/alerts')
  )
    return null;

  return (
    <>
      <button
        onClick={async () => {
          track('Click On', {
            place: 'technical_radar_notification',
          });
          if (posibleRelatedAlert) {
            void alertActions.openSaveModal();
          } else {
            void alertActions.save(false).then(() => setFirstToast(true));
          }
        }}
        className={clsx(
          'relative inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-6 text-xs text-v1-content-primary',
          'transition-all enabled:hover:brightness-110 enabled:active:brightness-90',
          posibleRelatedAlert
            ? 'border-v1-content-primary'
            : 'border-v1-border-brand bg-v1-content-brand',
          alerts.isLoading && 'animate-pulse',
          gtmClass('set-alert'),
          className,
        )}
        disabled={alertActions.isSaving}
      >
        {!posibleRelatedAlert && (
          <Badge
            className="absolute right-0 top-0 -m-2"
            color="wsdm"
            label={t('common:new')}
          />
        )}
        {alerts.isLoading || alertActions.isSaving ? (
          <GearIcon className="animate-spin" />
        ) : posibleRelatedAlert ? (
          <GearIcon />
        ) : (
          <ScreenerIcon />
        )}
        {posibleRelatedAlert ? t('screener.edit') : t('screener.set')}
      </button>
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
