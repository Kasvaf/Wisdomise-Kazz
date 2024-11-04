import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Link, useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import Table from 'shared/Table';
import { useWhalesCoins, type WhaleCoin } from 'api';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import Button from 'shared/Button';
import PageWrapper from 'modules/base/PageWrapper';
import ton from './ton.svg';

export default function PageHotCoins() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );
  const navigate = useNavigate();

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
          <Link to={row?.symbol.slug ?? ''}>
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
    <PageWrapper loading={coins.isLoading}>
      <h1 className="ms-5 flex items-center gap-2 py-3">
        <Image src={ton} alt="ton" />
        TON Hot Coins
      </h1>
      <Table
        className="mb-12"
        columns={columns}
        dataSource={coins.data?.results ?? []}
        rowKey={r => JSON.stringify(r.symbol)}
        loading={coins.isRefetching && !coins.isFetched}
        pagination={false}
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

      <Button
        variant="brand"
        className="fixed bottom-20 end-4 start-4 z-50"
        onClick={() => navigate('/market/the-open-network')}
      >
        Start Auto Trading
      </Button>
    </PageWrapper>
  );
}
