import { bxBell } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'services/rest';
import { type Alert, useAlerts } from 'services/rest/alert';
import { DebugPin } from 'shared/DebugPin';
import Icon from 'shared/Icon';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import { gtmClass } from 'utils/gtmClass';

export function PriceAlertButton({
  slug,
  className,
  variant,
  fab,
  ...props
}: Omit<ButtonProps, 'onClick' | 'disabled' | 'block' | 'children'> & {
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
      {hasFlag('/account/alerts') && hasFlag('/account/alerts?price_alert') && (
        <Button
          {...props}
          block
          className={clsx(className, gtmClass('set-alert'))}
          fab={fab}
          onClick={() => alertActions.openSaveModal()}
          variant={initialAlert.key ? 'outline' : variant}
        >
          <DebugPin
            color="orange"
            title={['/account/alerts', '/account/alerts?price_alert']}
          />
          <Icon name={bxBell} size={20} />
          {!fab &&
            (initialAlert.key
              ? t('set-price-notification.open-existing-modal-btn')
              : t('set-price-notification.open-modal-btn'))}
        </Button>
      )}
      {alertActions.content}
    </>
  );
}
