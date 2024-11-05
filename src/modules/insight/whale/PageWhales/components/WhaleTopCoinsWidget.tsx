import { type ReactNode, useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table from 'shared/Table';
import { type WhaleCoinsFilter, useWhalesCoins, type WhaleCoin } from 'api';
import { ButtonSelect } from 'shared/ButtonSelect';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ProLocker } from 'shared/ProLocker';
import { ReadableNumber } from 'shared/ReadableNumber';
import { CoinInfo } from './CoinInfo';
import { NetworkSelect } from './NetworkSelect';

const useWhaleCoinsFilters = () => {
  const { t } = useTranslation('whale');
  return [
    {
      label: t('filters.all'),
      value: 'all',
    },
    {
      label: t('filters.buy'),
      value: 'buy',
    },
    {
      label: t('filters.sell'),
      value: 'sell',
    },
    {
      label: t('filters.total_volume'),
      value: 'total_volume',
    },
    {
      label: t('filters.hold'),
      value: 'hold',
    },
  ] satisfies Array<{
    label: string;
    value: WhaleCoinsFilter;
  }>;
};
export function WhaleTopCoinsWidget({
  className,
  headerActions,
}: {
  className?: string;
  headerActions?: ReactNode;
}) {
  const { t } = useTranslation('whale');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<WhaleCoinsFilter>('all');
  const [networkName, setNetworkName] = useState<string | undefined>(undefined);
  const filters = useWhaleCoinsFilters();
  const coins = useWhalesCoins({
    page,
    pageSize,
    filter,
    sortBy,
    isAscending,
    networkName,
    days: 7,
  });

  const columns = useMemo<Array<ColumnType<WhaleCoin>>>(
    () => [
      {
        title: t('top_coins.name'),
        fixed: 'left',
        render: (_, row) => <Coin coin={row.symbol} imageClassName="size-6" />,
      },
      {
        title: [t('top_coins.info.title'), t('top_coins.info.info')],
        align: 'right',
        render: (_, row) => (
          <CoinInfo
            marketData={row.market_data}
            coin={row.symbol}
            linesClassName="justify-end"
          />
        ),
      },
      {
        title: [
          t('top_coins.buy_volume.title'),
          t('top_coins.buy_volume.info'),
        ],
        align: 'right',
        render: (_, row) => (
          <div className="flex flex-col items-end">
            <DirectionalNumber
              value={row.total_buy_volume}
              showSign={false}
              direction="up"
              label="$"
            />
            <div className="flex items-center gap-1 whitespace-nowrap text-xs">
              <span className="text-v1-content-secondary">
                {t('top_coins.buy_volume.avg')}:
              </span>
              <ReadableNumber
                value={
                  typeof row.total_buy_volume !== 'number' ||
                  row.total_buy_volume === 0
                    ? 0
                    : (row.total_buy_volume ?? 0) / (row.total_buy_number ?? 0)
                }
                label="$"
              />
            </div>
          </div>
        ),
      },
      {
        title: [
          t('top_coins.sell_volume.title'),
          t('top_coins.sell_volume.info'),
        ],
        align: 'right',
        render: (_, row) => (
          <div className="flex flex-col items-end">
            <DirectionalNumber
              value={row.total_sell_volume}
              showSign={false}
              direction="down"
              label="$"
            />
            <div className="flex items-center gap-1 whitespace-nowrap text-xs">
              <span className="text-v1-content-secondary">
                {t('top_coins.sell_volume.avg')}:
              </span>
              <ReadableNumber
                value={
                  typeof row.total_sell_volume !== 'number' ||
                  row.total_sell_volume === 0
                    ? 0
                    : (row.total_sell_volume ?? 0) /
                      (row.total_sell_number ?? 0)
                }
                label="$"
              />
            </div>
          </div>
        ),
      },
      {
        title: [t('top_coins.buys.title'), t('top_coins.buys.info')],
        align: 'right',
        render: (_, row) => (
          <DirectionalNumber
            value={row.total_buy_number}
            direction="up"
            showIcon={false}
          />
        ),
      },
      {
        title: [t('top_coins.sells.title'), t('top_coins.sells.info')],
        align: 'right',
        render: (_, row) => (
          <DirectionalNumber
            value={row.total_sell_number}
            direction="down"
            showIcon={false}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <OverviewWidget
      className={clsx(
        'min-h-[670px] shrink-0 xl:min-h-[631px] 2xl:min-h-[640px]',
        className,
      )}
      title={t('top_coins.title')}
      loading={coins.isInitialLoading}
      empty={coins.data?.results?.length === 0}
      headerClassName="flex-wrap !justify-start"
      headerActions={
        <>
          {headerActions && (
            <div className="flex grow justify-end">{headerActions}</div>
          )}
          <div className="flex w-full grow flex-wrap justify-between gap-4">
            <ButtonSelect
              value={filter}
              options={filters}
              onChange={newFilter => {
                setFilter(newFilter);
                setPage(1);
              }}
            />
            <NetworkSelect
              value={networkName}
              onChange={newNetworkName => {
                setNetworkName(newNetworkName);
                setPage(1);
              }}
            />
          </div>
        </>
      }
    >
      <ProLocker level={2} mode="table">
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
      </ProLocker>
    </OverviewWidget>
  );
}
