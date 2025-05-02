import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type Alert } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { AlertType } from 'modules/alert/components/AlertType';
import { AlertTarget } from 'modules/alert/components/AlertTarget';
import { AlertDeliveryMethods } from 'modules/alert/components/AlertDeliveryMethods';
import { AlertActions } from 'modules/alert/components/AlertActions';
import { ReadableDate } from 'shared/ReadableDate';
import { AlertStateChanger } from '../components/AlertStateChanger';
import { AlertFrequency } from '../components/AlertFrequency';

export function NotificationsAlertsWidget({ alerts }: { alerts: Alert[] }) {
  const { t } = useTranslation('alerts');

  const columns = useMemo<Array<TableColumn<Alert>>>(
    () => [
      {
        title: t('tables.creation-date'),
        width: 80,
        render: row => (
          <ReadableDate
            value={row.created_at}
            emptyText="---"
            className="whitespace-nowrap"
          />
        ),
      },
      {
        title: t('tables.type'),
        width: 250,
        render: row => <AlertType value={row} className="whitespace-nowrap" />,
      },
      {
        title: t('tables.description'),
        width: 320,
        render: row => <AlertTarget value={row} />,
      },
      {
        title: t('tables.delivery-methods'),
        render: row => <AlertDeliveryMethods value={row} />,
      },
      {
        title: t('tables.frequency'),
        render: row => (
          <AlertFrequency value={row} className="whitespace-nowrap" />
        ),
      },
      {
        title: t('tables.actions'),
        render: row => <AlertActions value={row} />,
      },
      {
        title: t('tables.status'),
        render: row => <AlertStateChanger value={row} />,
      },
    ],
    [t],
  );

  if (alerts.length === 0) return null;

  return (
    <OverviewWidget>
      <div className="mb-2 min-h-[37px] text-sm">
        {t('tables.notifications')}
      </div>
      <Table
        columns={columns}
        dataSource={alerts}
        rowKey={row => row.key ?? row.data_source}
        scrollable
      />
    </OverviewWidget>
  );
}
