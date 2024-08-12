import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { useWhalesCoins, type WhaleCoin } from 'api';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table from 'shared/Table';
import { PageTitle } from 'shared/PageTitle';
import { Coin } from 'shared/Coin';
import { ButtonSelect } from 'shared/ButtonSelect';

export function CoinsTable({ className }: { className?: string }) {
  const { t } = useTranslation('whale');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );
  const [timeFrame, setTimeFrame] = useState(1);

  const coins = useWhalesCoins({
    page,
    pageSize: 5,
    isAscending,
    sortBy,
    days: timeFrame,
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
          <Coin
            abbrevation={row.symbol_abbreviation}
            fullName={row.symbol_name}
            image={row.market_data.image}
          />
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
      <div className="flex flex-nowrap items-center justify-between gap-4">
        <PageTitle
          title={t('sections.top-coins.title')}
          description={t('sections.top-coins.subtitle')}
        />
        <ButtonSelect
          className="shrink-0"
          value={timeFrame}
          onChange={setTimeFrame}
          options={[
            {
              label: t('sections.top-coins.filters.1d'),
              value: 1,
            },
            {
              label: t('sections.top-coins.filters.7d'),
              value: 7,
            },
            {
              label: t('sections.top-coins.filters.30d'),
              value: 30,
              disabled: true,
            },
          ]}
        />
      </div>
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
          loading={coins.isFetching && coins.isPreviousData}
          rowKey="symbol_abbreviation"
        />
      </div>
    </div>
  );
}
