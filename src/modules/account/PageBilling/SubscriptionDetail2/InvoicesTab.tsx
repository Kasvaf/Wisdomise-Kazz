import { Table } from 'antd';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { useInvoicesQuery } from 'api';
import { type Invoice } from 'modules/account/models';

export default function InvoicesTab() {
  const { t } = useTranslation('billing');
  const { data } = useInvoicesQuery();

  const columns = useMemo<Array<ColumnType<Invoice>>>(
    () => [
      {
        title: t('subscription-details.invoices.method'),
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: t('subscription-details.invoices.issue-date'),
        dataIndex: 'issueDate',
        render: (_, { created_at: ca }) => new Date(ca).toLocaleString(),
      },
      {
        title: t('subscription-details.invoices.amount'),
        dataIndex: 'amount',
        render: (_, { amount_paid: ap }) => `$${ap}`,
      },
      {
        title: t('subscription-details.invoices.status'),
        dataIndex: 'status',
        render: status => <p className="capitalize">{status}</p>,
      },
    ],
    [t],
  );

  return <Table columns={columns} dataSource={data?.results ?? []} />;
}
