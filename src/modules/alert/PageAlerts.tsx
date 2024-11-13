import { useTranslation } from 'react-i18next';
import { bxBell, bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { type AlertState, useAlerts } from 'api/alert';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { gtmClass } from 'utils/gtmClass';
import TextBox from 'shared/TextBox';
import { useAlertActions } from './hooks/useAlertActions';
import { AlertEmptyWidget } from './components/AlertEmptyWidget';
import { AlertStateSelect } from './components/AlertStateSelect';
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

  const coinAlerts = useMemo(() => {
    const priceAlerts =
      alerts.data?.filter(
        row =>
          row.data_source === 'market_data' &&
          row.params.some(x => x.field_name === 'base'),
      ) ?? [];
    const baseSlugs = priceAlerts
      .map(
        row => row.params.find(x => x.field_name === 'base')?.value as string,
      )
      .filter((row, i, self) => self.indexOf(row) === i);
    return Object.fromEntries(
      baseSlugs.map(slug => [
        slug,
        priceAlerts.filter(
          row => row.params.find(x => x.field_name === 'base')?.value === slug,
        ),
      ]),
    );
  }, [alerts.data]);

  const notificationAlerts = useMemo(
    () =>
      alerts.data?.filter(
        row =>
          row.data_source === 'social_radar' ||
          row.data_source === 'manual:social_radar_daily_report',
      ) ?? [],
    [alerts.data],
  );

  return (
    <PageWrapper
      className="leading-none mobile:leading-normal"
      loading={alerts.isLoading}
    >
      <PageTitle
        title={t('base:menu.alerts.full-title')}
        description={t('base:menu.alerts.subtitle')}
      />
      <div className="my-8 flex flex-wrap items-center gap-4">
        <TextBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('common.search')}
          className="shrink-0 basis-80 mobile:basis-full"
          inputClassName="text-sm"
          suffix={<Icon name={bxSearch} />}
        />
        <AlertStateSelect value={alertState} onChange={setAlertState} />
        <div className="grow" />
        <Button
          onClick={() => alertActions.openSaveModal()}
          variant="primary"
          size="manual"
          className={clsx('h-12 px-7', gtmClass('set-alert'))}
        >
          <Icon name={bxBell} className="mr-2" size={24} />
          {t('common.set-alert')}
        </Button>
      </div>

      <div className="space-y-4">
        <NotificationsAlertsWidget
          alerts={notificationAlerts}
          stateQuery={alertState}
        />
        {Object.entries(coinAlerts).map(([slug, alerts]) => (
          <CoinAlertsWidget
            alerts={alerts}
            key={slug}
            searchQuery={searchQuery}
            stateQuery={alertState}
          />
        ))}
        {alerts.data?.length === 0 && (
          <AlertEmptyWidget className="h-[600px]" />
        )}
      </div>
      {alertActions.content}
    </PageWrapper>
  );
}
