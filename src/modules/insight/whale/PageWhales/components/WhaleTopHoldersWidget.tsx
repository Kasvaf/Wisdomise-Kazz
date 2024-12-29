import { type ReactNode, useEffect, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table, { useTableState } from 'shared/Table';
import { useHasFlag, useWhales, type WhaleShort, type WhalesFilter } from 'api';
import { ButtonSelect } from 'shared/ButtonSelect';
import { Wallet } from 'shared/Wallet';
import { Network } from 'shared/Network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coins } from 'shared/Coins';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { AccessShield } from 'shared/AccessShield';
import { NetworkSelect } from './NetworkSelect';

const useWhaleTopHoldersFilters = () => {
  const { t } = useTranslation('whale');
  const hasFlag = useHasFlag();
  return [
    {
      label: t('filters.all'),
      value: 'all',
      hidden: !hasFlag('?all_whales'),
    },
    {
      label: t('filters.best_to_copy'),
      value: 'best_to_copy',
      hidden: !hasFlag('?best_to_copy'),
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
    hidden?: boolean;
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
  const hasFlag = useHasFlag();
  const filters = useWhaleTopHoldersFilters();

  const [tableProps, tableState, setTableState] = useTableState('whales', {
    page: 1,
    pageSize: 5,
    sortOrder: 'ascending',
    filter: filters.find(x => !x.hidden)?.value ?? 'all',
    network: '',
  });

  const whales = useWhales({
    page: tableState.page,
    pageSize: tableState.pageSize,
    filter: tableState.filter,
    sortBy: tableState.sortBy,
    isAscending: tableState.sortOrder === 'ascending',
    networkName: tableState.network,
  });

  useEffect(() => {
    setTableState({
      total: whales.data?.count ?? 0,
    });
  }, [setTableState, whales.data?.count]);

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
        colSpan: hasFlag('?trading_pnl') ? 1 : 0,
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
        colSpan: hasFlag('?trading_pnl') ? 1 : 0,
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
        colSpan: hasFlag('?win_lose') ? 1 : 0,
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
    [hasFlag, t],
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
              value={tableState.filter}
              options={filters}
              onChange={filter => {
                setTableState({
                  filter,
                  page: 1,
                });
              }}
            />
            <NetworkSelect
              value={tableState.network || undefined}
              onChange={network => {
                setTableState({
                  network,
                  page: 1,
                });
              }}
            />
          </div>
        </>
      }
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'trial': true,
          'free': true,
          'pro': true,
          'pro+': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={whales.data?.results ?? []}
          rowKey="holder_address"
          loading={whales.isRefetching && !whales.isFetched}
          {...tableProps}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
