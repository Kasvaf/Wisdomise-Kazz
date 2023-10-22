import { Table } from 'antd';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useInvoicesQuery } from 'api';
import { type Invoice } from 'modules/account/models';

export default function Invoices() {
  const { data } = useInvoicesQuery();

  const columns = useMemo<Array<ColumnType<Invoice>>>(
    () => [
      {
        title: 'Issue Date',
        dataIndex: 'issueDate',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        render: (_, { created_at }) => new Date(created_at).toLocaleString(),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        render: (
          _,
          {
            data: {
              object: { description },
            },
          },
        ) => description ?? '-',
      },
      {
        title: 'Price',
        dataIndex: 'amount',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        render: (_, { amount_paid }) => amount_paid,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: status => status,
      },
      {
        title: '',
        dataIndex: 'share',
        render: (
          _,
          {
            data: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              object: { invoice_pdf },
            },
          },
        ) => (
          <a href={invoice_pdf} target="_blank" rel="noreferrer">
            Download
          </a>
        ),
      },
    ],
    [data],
  );

  return (
    <Table
      columns={columns}
      dataSource={data?.results ?? []}
      scroll={{ y: 170 }}
    />
  );
}
