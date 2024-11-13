import { type ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type Alert, type AlertState } from 'api/alert';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table from 'shared/Table';
import { AlertType } from 'modules/alert/components/AlertType';
import { AlertTarget } from 'modules/alert/components/AlertTarget';
import { AlertDeliveryMethods } from 'modules/alert/components/AlertDeliveryMethods';
import { AlertActions } from 'modules/alert/components/AlertActions';
import { AlertStateChanger } from '../components/AlertStateChanger';

export function NotificationsAlertsWidget({
  stateQuery,
  alerts,
}: {
  stateQuery?: AlertState;
  alerts: Alert[];
}) {
  const { t } = useTranslation('alerts');

  const columns = useMemo<Array<ColumnType<Alert>>>(
    () => [
      {
        title: t('tables.type'),
        render: (_, row) => <AlertType value={row} />,
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
        render: () => t('common.notifications.unlimited-times'),
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

  const alertsMatchedStateQuery = alerts.filter(row =>
    stateQuery
      ? row.state === stateQuery ||
        (row.state === 'SNOOZE' && stateQuery === 'ACTIVE')
      : true,
  );
  if (alertsMatchedStateQuery.length === 0) return null;

  return (
    <OverviewWidget>
      <div className="mb-2 min-h-[37px] text-sm">
        {t('tables.notifications')}
      </div>
      <Table
        columns={columns}
        dataSource={alertsMatchedStateQuery}
        rowKey={row => row.key ?? ''}
        pagination={false}
        rowClassName="[&_td]:!py-6"
      />
    </OverviewWidget>
  );
}
