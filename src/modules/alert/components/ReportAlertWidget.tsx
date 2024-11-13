import { type ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type Alert, type AlertState } from 'api/alert';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table from 'shared/Table';
import { AlertType } from './AlertType';
import { AlertTarget } from './AlertTarget';
import { AlertDeliveryMethods } from './AlertDeliveryMethods';
import { AlertActions } from './AlertActions';

const fakeAlert: Alert = {
  conditions: [],
  messengers: ['EMAIL'],
  params: [],
  state: 'ACTIVE',
  config: {},
};

export function ReportAlertWidget({ stateQuery }: { stateQuery?: AlertState }) {
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
        title: t('tables.interval'),
        render: () => t('common.notifications.invervals.daily'),
      },
      {
        title: t('tables.actions'),
        render: (_, row) => <AlertActions value={row} />,
      },
    ],
    [t],
  );

  if (stateQuery === 'DISABLED') return null;

  return (
    <OverviewWidget>
      <div className="mb-2 min-h-[37px] text-sm">
        {t('tables.notifications')}
      </div>
      <Table
        columns={columns}
        dataSource={[fakeAlert]}
        rowKey={row => row.key ?? ''}
        pagination={false}
        rowClassName="[&_td]:!py-6"
      />
    </OverviewWidget>
  );
}
