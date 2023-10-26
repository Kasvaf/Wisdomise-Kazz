import { Table } from 'antd';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useInvoicesQuery } from 'api';
import { type Invoice } from 'modules/account/models';

export default function InvoicesTab() {
  const { data } = useInvoicesQuery();

  const columns = useMemo<Array<ColumnType<Invoice>>>(
    () => [
      {
        title: 'Payment Method',
        dataIndex: 'method',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        render: (_, { payment_method }) => (
          <p className="capitalize">{payment_method.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'Issue Date',
        dataIndex: 'issueDate',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        render: (_, { created_at }) => new Date(created_at).toLocaleString(),
      },
      {
        title: 'Price',
        dataIndex: 'amount',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        render: (_, { amount_paid }) => `$${amount_paid}`,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: status => <p className="capitalize">{status}</p>,
      },
    ],
    [],
  );

  return <Table columns={columns} dataSource={data?.results ?? []} />;
}
