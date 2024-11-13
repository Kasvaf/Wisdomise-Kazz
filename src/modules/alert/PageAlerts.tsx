import { useTranslation } from 'react-i18next';
import { bxBell, bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { type AlertState, useAlerts, useIsSubscribedToReport } from 'api/alert';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { gtmClass } from 'utils/gtmClass';
import TextBox from 'shared/TextBox';
import { useAlertActions } from './hooks/useAlertActions';
import { AlertEmptyWidget } from './components/AlertEmptyWidget';
import { AlertStateSelect } from './components/AlertStateSelect';
import { SlugAlertGroupWidget } from './components/SlugAlertGroupWidget';
import { ReportAlertWidget } from './components/ReportAlertWidget';

export default function AlertsPage() {
  const { t } = useTranslation('alerts');
  const marketDataAlerts = useAlerts({
    data_source: 'market_data',
  });
  const reportAlert = useIsSubscribedToReport();
  const alertActions = useAlertActions({});

  const isEmpty = useMemo(() => {
    return !reportAlert.data && marketDataAlerts.data?.length === 0;
  }, [reportAlert, marketDataAlerts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [alertState, setAlertState] = useState<AlertState | undefined>(
    undefined,
  );

  const groupedPriceAlerts = useMemo(() => {
    const hasBaseRows = (marketDataAlerts.data ?? []).filter(
      row => row.params.findIndex(x => x.field_name === 'base') >= 0,
    );
    const baseSlugs = hasBaseRows
      .map(
        row => row.params.find(x => x.field_name === 'base')?.value as string,
      )
      .filter((row, i, self) => self.indexOf(row) === i);
    return Object.fromEntries(
      baseSlugs.map(slug => [
        slug,
        hasBaseRows.filter(
          row => row.params.find(x => x.field_name === 'base')?.value === slug,
        ),
      ]),
    );
  }, [marketDataAlerts]);

  return (
    <PageWrapper
      className="leading-none mobile:leading-normal"
      loading={marketDataAlerts.isLoading || reportAlert.isLoading}
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
        {reportAlert.data && <ReportAlertWidget stateQuery={alertState} />}
        {Object.entries(groupedPriceAlerts).map(([slug, alerts]) => (
          <SlugAlertGroupWidget
            slug={slug}
            alerts={alerts}
            key={slug}
            searchQuery={searchQuery}
            stateQuery={alertState}
          />
        ))}
        {isEmpty && <AlertEmptyWidget className="h-[600px]" />}
      </div>
      {alertActions.content}
    </PageWrapper>
  );
}
