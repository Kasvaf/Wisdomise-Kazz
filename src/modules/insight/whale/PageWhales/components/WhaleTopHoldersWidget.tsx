import { type ReactNode, useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table from 'shared/Table';
import { useWhales, type WhaleShort, type WhalesFilter } from 'api';
import { ButtonSelect } from 'shared/ButtonSelect';
import { Wallet } from 'shared/Wallet';
import { Network } from 'shared/Network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coins } from 'shared/Coins';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ProLocker } from 'shared/ProLocker';
import { NetworkSelect } from './NetworkSelect';

const useWhaleTopHoldersFilters = () => {
  const { t } = useTranslation('whale');
  return [
    {
      label: t('filters.all'),
      value: 'all',
    },
    {
      label: t('filters.best_to_copy'),
      value: 'best_to_copy',
    },
    {
      label: t('filters.holders'),
      value: 'holders',
    },
    {
      label: t('filters.wealthy_wallets'),
      value: 'wealthy_wallets',
    },
  ] satisfies Array<{
    label: string;
    value: WhalesFilter;
  }>;
};
export function WhaleTopHoldersWidget({
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
  const [filter, setFilter] = useState<WhalesFilter>('all');
  const [networkName, setNetworkName] = useState<string | undefined>(undefined);
  const filters = useWhaleTopHoldersFilters();
  const whales = useWhales({
    page,
    pageSize,
    filter,
    sortBy,
    isAscending,
    networkName,
  });

  const columns = useMemo<Array<ColumnType<WhaleShort>>>(
    () => [
      {
        title: t('top_whales.address'),
        fixed: 'left',
        render: (_, row) => (
          <Wallet
            wallet={{
              address: row.holder_address,
              network: row.network_name,
            }}
          />
        ),
      },
      {
        title: t('top_whales.network'),
        render: (_, row) => (
          <Network
            network={{
              name: row.network_name,
              icon_url: row.network_icon_url,
            }}
            imageClassName="size-4"
          />
        ),
      },
      {
        title: [t('top_whales.balance.title'), t('top_whales.balance.info')],
        align: 'right',
        dataIndex: 'balance_usdt',
        sorter: true,
        render: (_, row) => (
          <ReadableNumber label="$" value={row.balance_usdt} popup="never" />
        ),
      },
      {
        title: [
          t('top_whales.trading_volume.title'),
          t('top_whales.trading_volume.info'),
        ],
        align: 'right',
        render: (_, row) => (
          <ReadableNumber
            label="$"
            value={row.recent_trading_volume}
            popup="never"
          />
        ),
      },
      {
        title: t('top_whales.tokens'),
        align: 'right',
        render: (_, row) => <Coins coins={row.top_assets.map(r => r.symbol)} />,
      },
      {
        title: [
          t('top_whales.trading_pnl.title'),
          t('top_whales.trading_pnl.info'),
        ],
        align: 'right',
        dataIndex: 'recent_trading_pnl',
        sorter: true,
        render: (_, row) => (
          <DirectionalNumber
            value={row.recent_trading_pnl}
            label="$"
            showSign
          />
        ),
      },
      {
        title: [t('top_whales.returns.title'), t('top_whales.returns.info')],
        align: 'right',
        dataIndex: 'recent_trading_pnl_percentage',
        sorter: true,
        render: (_, row) => (
          <DirectionalNumber
            value={row.recent_trading_pnl_percentage}
            label="%"
            showSign
          />
        ),
      },
      {
        title: t('top_whales.wins_losses'),
        align: 'right',
        render: (_, row) => (
          <div>
            <ReadableNumber value={row.recent_trading_wins ?? 0} />
            <span>/</span>
            <ReadableNumber value={row.recent_trading_losses ?? 0} />
          </div>
        ),
      },
      {
        title: t('top_whales.buy_sell'),
        align: 'right',
        render: (_, row) => (
          <div>
            <ReadableNumber
              value={row.recent_total_buys}
              className="text-v1-content-positive"
            />
            <span className="text-v1-content-secondary">/</span>
            <ReadableNumber
              value={row.recent_total_sells}
              className="text-v1-content-negative"
            />
          </div>
        ),
      },
      {
        title: t('top_whales.trading_holding'),
        align: 'right',
        render: (_, row) => (
          <div>
            <ReadableNumber value={row.total_trading_assets ?? 0} />
            <span>/</span>
            <ReadableNumber value={row.total_holding_assets ?? 0} />
          </div>
        ),
      },
      {
        title: [
          t('top_whales.trades_per_day.title'),
          t('top_whales.trades_per_day.info'),
        ],
        align: 'right',
        render: (_, row) => (
          <ReadableNumber
            value={row?.recent_average_trades_per_day}
            popup="never"
          />
        ),
      },
    ],
    [t],
  );

  return (
    <OverviewWidget
      className={clsx(
        'min-h-[647px] xl:min-h-[620px] 2xl:min-h-[627px]',
        className,
      )}
      title={t('top_whales.title')}
      loading={whales.isInitialLoading}
      empty={whales.data?.results?.length === 0}
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
          dataSource={whales.data?.results ?? []}
          rowKey="holder_address"
          loading={whales.isRefetching && !whales.isFetched}
          pagination={{
            total: whales.data?.count ?? 1,
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
