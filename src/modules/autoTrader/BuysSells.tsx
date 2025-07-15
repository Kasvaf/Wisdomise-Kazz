import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Pagination } from 'antd';
import { bxLinkExternal } from 'boxicons-quasar';
import type { Wallet } from 'api/wallets';
import { type Swap, useTraderBuysSellsQuery } from 'api';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import PriceChange from 'shared/PriceChange';
import { roundSensible } from 'utils/numbers';
import { useSymbolsInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';
import Badge from 'shared/Badge';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';

const PAGE_SIZE = 30;
export default function BuysSells({ wallet }: { wallet: Wallet }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTraderBuysSellsQuery({
    page,
    pageSize: PAGE_SIZE,
    address: wallet.address,
  });
  const { data: symbols } = useSymbolsInfo(
    data?.results?.map(s => s.base_slug),
  );

  const columns = useMemo<Array<TableColumn<Swap>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        sticky: 'start',
        render: row => (
          <div className="text-xs">
            {(() => {
              const coin = symbols?.find(s => s.slug === row.base_slug);
              return coin ? <Coin coin={coin} /> : null;
            })()}
          </div>
        ),
      },
      {
        key: 'type',
        title: 'Type',
        render: row => (
          <Badge
            className="h-auto !text-xs"
            label={row.side === 'SHORT' ? 'Sell' : 'Buy'}
            color={row.side === 'SHORT' ? 'red' : 'green'}
          />
        ),
      },
      {
        key: 'amount',
        title: 'Amount',
        render: row => (
          <span className="text-xs">${roundSensible(row.trading_volume)}</span>
        ),
      },
      {
        key: 'pnl',
        title: 'Pnl',
        render: row =>
          row.pnl_usd ? (
            <PriceChange className="text-xs" value={Number(row.pnl_usd)} />
          ) : null,
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
          <Button
            fab
            size="xs"
            variant="ghost"
            className="!bg-transparent text-white/70"
            onClick={() => window.open(row.transaction_link, '_blank')}
          >
            <Icon name={bxLinkExternal} />
          </Button>
        ),
      },
    ],
    [symbols],
  );

  return (
    <Table
      columns={columns}
      dataSource={data?.results}
      chunkSize={5}
      loading={isLoading}
      rowKey={r => r.transaction_link}
      surface={2}
      scrollable
      footer={
        <Pagination
          current={+page}
          onChange={x => setPage(x)}
          pageSize={PAGE_SIZE}
          total={data?.count}
          hideOnSinglePage
          responsive
        />
      }
    />
  );
}
