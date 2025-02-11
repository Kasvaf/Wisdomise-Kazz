import { type ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type Alert } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table from 'shared/Table';
import { AlertType } from 'modules/alert/components/AlertType';
import { AlertTarget } from 'modules/alert/components/AlertTarget';
import { AlertDeliveryMethods } from 'modules/alert/components/AlertDeliveryMethods';
import { AlertActions } from 'modules/alert/components/AlertActions';
import { ReadableDate } from 'shared/ReadableDate';
import { AlertStateChanger } from '../components/AlertStateChanger';
import { AlertFrequency } from '../components/AlertFrequency';

export function NotificationsAlertsWidget({ alerts }: { alerts: Alert[] }) {
  const { t } = useTranslation('alerts');

  const columns = useMemo<Array<ColumnType<Alert>>>(
    () => [
      {
        title: t('tables.creation-date'),
        render: (_, row) => (
          <ReadableDate
            value={row.created_at}
            emptyText="---"
            className="whitespace-nowrap"
          />
        ),
      },
      {
        title: t('tables.type'),
        render: (_, row) => (
          <AlertType value={row} className="whitespace-nowrap" />
        ),
      },
      {
        title: t('tables.description'),
        className: '!max-w-72',
        render: (_, row) => <AlertTarget value={row} />,
      },
      {
        title: t('tables.delivery-methods'),
        render: (_, row) => <AlertDeliveryMethods value={row} />,
      },
      {
        title: t('tables.frequency'),
        render: (_, row) => (
          <AlertFrequency value={row} className="whitespace-nowrap" />
        ),
      },
      {
        title: t('tables.actions'),
        render: (_, row) => <AlertActions value={row} />,
      },
      {
        title: t('tables.status'),
        render: (_, row) => <AlertStateChanger value={row} />,
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
        pagination={false}
        rowClassName="[&_td]:!py-6"
      />
    </OverviewWidget>
  );
}
