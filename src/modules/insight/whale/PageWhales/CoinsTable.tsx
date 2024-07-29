import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { useWhalesCoins, type WhaleCoin } from 'api';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table from 'shared/Table';
import { PageTitle } from 'shared/PageTitle';

const PAGE_SIZE = 10;

export function CoinsTable({ className }: { className?: string }) {
  const { t } = useTranslation('whale');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );

  const coins = useWhalesCoins({
    page,
    pageSize: PAGE_SIZE,
    isAscending,
    sortBy,
  });
  const columns = useMemo<Array<ColumnType<WhaleCoin>>>(
    () => [
      {
        title: t('sections.top-coins.table.rank'),
        dataIndex: 'rank',
        sorter: true,
      },
      {
        title: t('sections.top-coins.table.coin'),
        dataIndex: 'symbol_abbreviation',
        render: (_, row) => (
          <span className="inline-flex items-center gap-1">
            <img
              src={row.market_data.image}
              className="size-5 rounded-full bg-white"
              alt={row.symbol_abbreviation}
            />
            {row.symbol_abbreviation}
          </span>
        ),
      },
      {
        title: t('sections.top-coins.table.transactions'),
        dataIndex: 'total_transactions',
        sorter: true,
        render: (_, row) => <ReadableNumber value={row.total_transactions} />,
      },
      {
        title: t('sections.top-coins.table.total-vol'),
        dataIndex: 'total_volume',
        sorter: true,
        render: (_, row) => (
          <ReadableNumber
            value={row.total_volume}
            label={row.symbol_abbreviation}
          />
        ),
      },
      {
        title: t('sections.top-coins.table.price'),
        dataIndex: 'current_price',
        sorter: true,
        render: (_, row) => (
          <ReadableNumber value={row.market_data.current_price} label="usdt" />
        ),
      },
      {
        title: t('sections.top-coins.table.24h_chg'),
        dataIndex: 'price_change_percentage_24h',
        sorter: true,
        render: (_, row) => (
          <PriceChange
            className="inline-flex"
            staticValue={row.market_data.price_change_24h}
            value={row.market_data.price_change_percentage_24h}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className={clsx('flex flex-col gap-6', className)}>
      <PageTitle
        title={t('sections.top-coins.title')}
        description={t('sections.top-coins.subtitle')}
      />
      <div className="-mx-6 overflow-auto px-6">
        <Table
          columns={columns}
          dataSource={coins.data?.results ?? []}
          pagination={{
            total: coins.data?.count ?? 1,
          }}
          onChange={(pagination, _, sorter) => {
            setPage(pagination.current ?? 1);
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
          loading={coins.isFetching}
          rowKey="symbol_abbreviation"
        />
      </div>
    </div>
  );
}
