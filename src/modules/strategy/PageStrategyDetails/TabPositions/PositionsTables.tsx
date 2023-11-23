import { Table } from 'antd';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useInvoicesQuery } from 'api';
import { type Invoice } from 'modules/account/models';

export default function PositionsTables() {
  const { data } = useInvoicesQuery();

  const columns = useMemo<Array<ColumnType<Invoice>>>(
    () => [
      {
        title: '#',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'Pair',
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'Size',
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'P/L',
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'Entry Point',
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'Entry Diff %',
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'Exit Point',
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
      {
        title: 'Exit Diff %',
        dataIndex: 'method',
        render: (_, { payment_method: pm }) => (
          <p className="capitalize">{pm.toLocaleLowerCase()}</p>
        ),
      },
    ],
    [],
  );

  return <Table columns={columns} dataSource={data?.results ?? []} />;
}
