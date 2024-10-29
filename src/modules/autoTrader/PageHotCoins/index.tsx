import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import Table from 'shared/Table';
import { useWhalesCoins, type WhaleCoin } from 'api';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import Button from 'shared/Button';

export default function PageHotCoins() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );

  const coins = useWhalesCoins({
    page,
    pageSize,
    filter: undefined,
    sortBy,
    isAscending,
    networkName: 'ton',
    days: 7,
  });

  const columns = useMemo<Array<ColumnType<WhaleCoin>>>(
    () => [
      {
        fixed: 'left',
        render: (_, row) => (
          <Link to={row.symbol.slug ?? ''}>
            <Coin coin={row.symbol} imageClassName="size-6" nonLink={true} />
          </Link>
        ),
      },
      {
        align: 'right',
        render: (_, row) => (
          <div className="flex flex-col items-end">
            <ReadableNumber value={row.market_data.current_price} label="$" />
            <DirectionalNumber
              value={row.market_data.price_change_percentage_24h}
              showSign
              className="text-[0.89em]"
              showIcon={false}
              label="%"
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <h1 className="py-3">TON Hot Coins</h1>
      <Table
        columns={columns}
        dataSource={coins.data?.results ?? []}
        rowKey={r => JSON.stringify(r.symbol)}
        loading={coins.isRefetching && !coins.isFetched}
        pagination={{
          total: coins.data?.count ?? 1,
          current: page,
          showSizeChanger: true,
          pageSize,
          pageSizeOptions: [5, 10, 20],
        }}
        onChange={(pagination, _, sorter) => {
          setPage(pagination.current ?? 1);
          setPageSize(pagination.pageSize ?? 5);
          if (!Array.isArray(sorter)) {
            setSortBy(
              typeof sorter.field === 'string' && sorter.order
                ? sorter.field
                : undefined,
            );
            setIsAscending(
              sorter.order === 'ascend'
                ? true
                : sorter.order === 'descend'
                ? false
                : undefined,
            );
          }
        }}
      />
      <Button variant="brand" className="w-full">
        Select a Coin to Start
      </Button>
    </div>
  );
}
