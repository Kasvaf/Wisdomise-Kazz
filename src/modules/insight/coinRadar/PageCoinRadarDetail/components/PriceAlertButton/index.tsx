import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { bxBell } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useHasFlag } from 'api';
import { type Alert, useAlerts } from 'api/alert';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { gtmClass } from 'utils/gtmClass';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { DebugPin } from 'shared/DebugPin';

export function PriceAlertButton({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();

  const possibleRelatedAlerts = useAlerts({
    data_source: 'market_data',
    params: [
      {
        field_name: 'base',
        value: slug,
      },
    ],
  });

  const initialAlert = useMemo<Partial<Alert>>(() => {
    return (
      possibleRelatedAlerts.data?.[0] || {
        data_source: 'market_data',
        params: [
          {
            field_name: 'base',
            value: slug,
          },
          {
            field_name: 'quote',
            value: 'tether',
          },
        ],
        conditions: [
          {
            field_name: 'last_price',
            operator: 'GREATER',
            threshold: '0',
          },
        ],
        messengers: ['EMAIL'],
        config: {
          dnd_interval: 3600,
          one_time: false,
        },
      }
    );
  }, [possibleRelatedAlerts.data, slug]);

  const alertActions = useAlertActions(initialAlert, true);

  useOnSearchParamDetectedOnce({
    callback: () => alertActions.openSaveModal(),
    active: possibleRelatedAlerts.isFetched,
    searchParam: 'open-alert',
  });

  return (
    <>
      <Button
        onClick={() => alertActions.openSaveModal()}
        variant={initialAlert.key ? 'alternative' : 'primary'}
        className={clsx(
          'h-10 w-full !py-1 mobile:!px-4',
          className,
          gtmClass('set-alert'),
        )}
        contentClassName="flex gap-0"
        disabled={
          !hasFlag('/coin-radar/alerts') ||
          !hasFlag('/coin-radar/alerts?price_alert')
        }
      >
        <DebugPin
          title={['/coin-radar/alerts', '/coin-radar/alerts?price_alert']}
          color="orange"
        />
        <Icon size={20} name={bxBell} className="mr-1" />
        {initialAlert.key
          ? t('set-price-notification.open-existing-modal-btn')
          : t('set-price-notification.open-modal-btn')}
      </Button>
      {alertActions.content}
    </>
  );
}
