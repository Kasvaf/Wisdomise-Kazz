import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
import Table from 'shared/Table';
import { useHasFlag, useTraderCoins, type WhaleCoin } from 'api';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import PageWrapper from 'modules/base/PageWrapper';
import AlertButton from './AlertButton';
import ton from './ton.svg';

export default function PageHotCoins() {
  const hasFlag = useHasFlag();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );

  const coins = useTraderCoins({
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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 py-3">
          <Image src={ton} alt="ton" />
          TON Hot Coins
        </h1>
        {hasFlag('/trader-alerts') && <AlertButton />}
      </div>
      <Table
        className="mb-12"
        columns={columns}
        dataSource={coins.data?.results ?? []}
        rowKey={r => JSON.stringify(r.symbol)}
        loading={coins.isRefetching && !coins.isFetched}
        showHeader={false}
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
    </PageWrapper>
  );
}
