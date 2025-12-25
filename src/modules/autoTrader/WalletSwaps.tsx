import { Pagination } from 'antd';
import { bxLinkExternal } from 'boxicons-quasar';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { type Swap, useTraderSwapsQuery } from 'services/rest';
import type { Wallet } from 'services/rest/wallets';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';

const PAGE_SIZE = 30;
export default function WalletSwaps({ wallet }: { wallet: Wallet }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTraderSwapsQuery({
    page,
    pageSize: PAGE_SIZE,
    address: wallet.address,
  });

  const columns = useMemo<Array<TableColumn<Swap>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        sticky: 'start',
        render: row => {
          return <Token autoFill slug={row.base_slug} />;
        },
      },
      {
        key: 'type',
        title: 'Type',
        render: row => (
          <Badge color={row.side === 'SHORT' ? 'negative' : 'positive'}>
            {row.side === 'SHORT' ? 'Sell' : 'Buy'}
          </Badge>
        ),
      },
      {
        key: 'amount',
        title: 'Amount',
        render: row => (
          <ReadableNumber className="text-xs" value={+row.trading_volume} />
        ),
      },
      {
        key: 'age',
        title: 'Age',
        className: 'text-xs',
        render: row => dayjs(row.created_at).fromNow(false),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: row => (
          <div>
            <Button
              className="text-v1-content-primary/70"
              fab
              onClick={() => window.open(row.transaction_link, '_blank')}
              size="xs"
              variant="ghost"
            >
              <Icon name={bxLinkExternal} />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <Table
      chunkSize={5}
      columns={columns}
      dataSource={data?.results}
      footer={
        <Pagination
          current={+page}
          hideOnSinglePage
          onChange={x => setPage(x)}
          pageSize={PAGE_SIZE}
          responsive
          total={data?.count}
        />
      }
      loading={isLoading}
      rowKey={r => r.key}
      scrollable
      surface={1}
    />
  );
}
