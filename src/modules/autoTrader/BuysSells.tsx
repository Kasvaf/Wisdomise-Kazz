import { Pagination } from 'antd';
import { type Swap, useTraderBuysSellsQuery } from 'api';
import { useSymbolsInfo } from 'api/symbol';
import type { Wallet } from 'api/wallets';
import { bxLinkExternal } from 'boxicons-quasar';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import Badge from 'shared/Badge';
import { Coin } from 'shared/Coin';
import Icon from 'shared/Icon';
import PriceChange from 'shared/PriceChange';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { roundSensible } from 'utils/numbers';

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
            className="!text-xs h-auto"
            color={row.side === 'SHORT' ? 'red' : 'green'}
            label={row.side === 'SHORT' ? 'Sell' : 'Buy'}
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
            className="!bg-transparent text-white/70"
            fab
            onClick={() => window.open(row.transaction_link, '_blank')}
            size="xs"
            variant="ghost"
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
      rowKey={r => r.transaction_link}
      scrollable
      surface={1}
    />
  );
}
