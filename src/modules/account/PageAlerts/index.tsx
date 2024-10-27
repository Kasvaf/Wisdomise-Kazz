import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { bxBell, bxSearch } from 'boxicons-quasar';
import { type AlertState, useAlerts } from 'api/alert';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import TextBox from 'shared/TextBox';
import { useAlertActions } from './components/useAlertActions';
import { SlugAlertGroupWidget } from './components/SlugAlertGroupWidget';
import { AlertStateSelect } from './components/AlertStateSelect';
import { AlertEmptyWidget } from './components/AlertEmptyWidget';
import { CustomAlertGroupWidget } from './components/CustomAlertGroupWidget';

export default function AlertsPage() {
  const { t } = useTranslation('alerts');
  const marketDataAlerts = useAlerts('market_data');
  const coinRadarAlerts = useAlerts('custom:coin_radar_notification');
  const alertActions = useAlertActions();
  const [searchQuery, setSearchQuery] = useState('');
  const [alertState, setAlertState] = useState<AlertState | undefined>(
    undefined,
  );

  const marketDataAlertsGroupedByBase = useMemo(() => {
    if (!marketDataAlerts.data) return [];
    const hasBaseRows = marketDataAlerts.data.filter(
      row => row.dataSource === 'market_data' && row.params.base,
    );
    const baseSlugs = hasBaseRows
      .map(row => row.params.base as string)
      .filter((row, i, self) => self.indexOf(row) === i);
    return Object.fromEntries(
      baseSlugs.map(slug => [
        slug,
        hasBaseRows.filter(row => row.params.base === slug),
      ]),
    );
  }, [marketDataAlerts]);

  return (
    <PageWrapper
      className="leading-none mobile:leading-normal"
      loading={marketDataAlerts.isLoading || coinRadarAlerts.isLoading}
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
          className="h-12 px-7"
          data-id="set-alert"
        >
          <Icon name={bxBell} className="mr-2" size={24} />
          {t('common.set-alert')}
        </Button>
      </div>

      <div className="space-y-4">
        {coinRadarAlerts.data?.length !== 0 && (
          <CustomAlertGroupWidget
            alerts={coinRadarAlerts.data ?? []}
            stateQuery={alertState}
          />
        )}
        {Object.entries(marketDataAlertsGroupedByBase).map(([slug, alerts]) => (
          <SlugAlertGroupWidget
            slug={slug}
            alerts={alerts}
            key={slug}
            searchQuery={searchQuery}
            stateQuery={alertState}
          />
        ))}
        {Object.entries(marketDataAlertsGroupedByBase).length === 0 &&
          coinRadarAlerts.data?.length === 0 && (
            <AlertEmptyWidget className="h-[600px]" />
          )}
      </div>
      {alertActions.content}
    </PageWrapper>
  );
}
