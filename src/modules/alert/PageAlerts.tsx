import { bxBell } from 'boxicons-quasar';
import PageWrapper from 'modules/base/PageWrapper';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type AlertState, useAlerts } from 'services/rest/alert';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import Icon from 'shared/Icon';
import { PageTitle } from 'shared/PageTitle';
import { SearchInput } from 'shared/SearchInput';
import { Button } from 'shared/v1-components/Button';
import { gtmClass } from 'utils/gtmClass';
import { AlertEmptyWidget } from './components/AlertEmptyWidget';
import { AlertStateSelect } from './components/AlertStateSelect';
import { useAlertActions } from './hooks/useAlertActions';
import { CoinAlertsWidget } from './widgets/CoinAlertsWidget';
import { NotificationsAlertsWidget } from './widgets/NotificationsAlertsWidget';

export default function AlertsPage() {
  const { t } = useTranslation('alerts');
  const alerts = useAlerts();
  const alertActions = useAlertActions({});

  const [searchQuery, setSearchQuery] = useState('');
  const [alertState, setAlertState] = useState<AlertState | undefined>(
    undefined,
  );

  const filteredAlerts = useMemo(() => {
    const q = searchQuery?.toLowerCase() ?? '';
    return (alerts.data ?? [])
      .filter(x => !q || JSON.stringify(x).toLowerCase().includes(q))
      .filter(row =>
        alertState
          ? row.state === alertState ||
            (row.state === 'SNOOZE' && alertState === 'ACTIVE')
          : true,
      );
  }, [searchQuery, alerts.data, alertState]);

  const coinAlerts = useMemo(() => {
    const priceAlerts =
      filteredAlerts.filter(
        row =>
          row.data_source === 'market_data' &&
          row.params.some(x => x.field_name === 'base'),
      ) ?? [];
    const baseSlugs = priceAlerts
      .map(
        row => row.params.find(x => x.field_name === 'base')?.value as string,
      )
      .filter((row, i, self) => self.indexOf(row) === i);
    return baseSlugs.map(
      slug =>
        [
          slug,
          priceAlerts.filter(
            row =>
              row.params.find(x => x.field_name === 'base')?.value === slug,
          ),
        ] as const,
    );
  }, [filteredAlerts]);

  const notificationAlerts = useMemo(
    () =>
      filteredAlerts.filter(
        row =>
          row.data_source === 'social_radar' ||
          row.data_source === 'technical_radar' ||
          row.data_source === 'coin_radar' ||
          row.data_source === 'manual:social_radar_daily_report',
      ) ?? [],
    [filteredAlerts],
  );

  return (
    <PageWrapper
      className="leading-none max-md:leading-normal"
      extension={<CoinExtensionsGroup />}
      hasBack
      loading={alerts.isLoading}
      title={t('base:menu.alerts.full-title')}
    >
      <PageTitle description={t('base:menu.alerts.subtitle')} />

      <div className="my-8 flex flex-wrap items-center gap-2">
        <SearchInput
          onChange={setSearchQuery}
          placeholder={t('common.search')}
          size="md"
          value={searchQuery}
        />
        <AlertStateSelect onChange={setAlertState} value={alertState} />
        <div className="grow" />
        <Button
          className={gtmClass('set-alert')}
          onClick={() => alertActions.openSaveModal()}
          size="sm"
          variant="white"
        >
          <Icon name={bxBell} size={24} />
          {t('common.set-alert')}
        </Button>
      </div>

      <div className="space-y-4">
        <NotificationsAlertsWidget alerts={notificationAlerts} />
        {coinAlerts.map(([slug, slugAlerts]) => (
          <CoinAlertsWidget alerts={slugAlerts} key={slug} />
        ))}
        {(alerts.data ?? []).length === 0 && (
          <AlertEmptyWidget className="h-[600px]" />
        )}
      </div>
      {alertActions.content}
    </PageWrapper>
  );
}
