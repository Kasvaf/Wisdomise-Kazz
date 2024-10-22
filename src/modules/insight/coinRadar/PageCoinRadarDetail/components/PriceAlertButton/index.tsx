import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { bxBell } from 'boxicons-quasar';
import { useHasFlag } from 'api';
import { type Alert, useAlerts } from 'api/alert';
import { useAlertActions } from 'modules/account/PageAlerts/components/useAlertActions';
import { useOnSearchParamDetectedOnce } from 'shared/useOnSearchParamDetectedOnce';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

export function PriceAlertButton({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();

  const possibleRelatedAlerts = useAlerts('market_data', {
    base: slug,
  });
  const initialAlert = useMemo(() => {
    return (possibleRelatedAlerts.data?.at(-1) || {
      dataSource: 'market_data',
      params: {
        base: slug,
      },
    }) as Partial<Alert<'market_data'>>;
  }, [possibleRelatedAlerts.data, slug]);

  const alertActions = useAlertActions(initialAlert);

  useOnSearchParamDetectedOnce({
    callback: () => alertActions.openSaveModal(),
    active: possibleRelatedAlerts.isFetched,
    searchParam: 'open-alert',
  });

  if (!hasFlag('/insight/alerts?price')) return null;

  return (
    <>
      <Button
        onClick={() => alertActions.openSaveModal()}
        variant={initialAlert.key ? 'alternative' : 'primary'}
        className={clsx('h-10 w-auto !py-1 mobile:!px-4', className)}
        contentClassName="flex gap-0"
        data-id="set-alert"
      >
        <Icon size={20} name={bxBell} className="mr-1" />
        {initialAlert.key
          ? t('set-price-notification.open-existing-modal-btn')
          : t('set-price-notification.open-modal-btn')}
      </Button>
      {alertActions.content}
    </>
  );
}
