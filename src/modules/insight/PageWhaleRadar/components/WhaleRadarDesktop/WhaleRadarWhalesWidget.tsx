import { type ReactNode, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table, { useTableState } from 'shared/Table';
import { useHasFlag, useWhaleRadarWhales, type WhaleShort } from 'api';
import { Wallet } from 'shared/Wallet';
import { Network } from 'shared/Network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coins } from 'shared/Coins';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { AccessShield } from 'shared/AccessShield';
import { DebugPin } from 'shared/DebugPin';
import { NetworkSelect } from 'shared/NetworkSelect';
import { SearchInput } from 'shared/SearchInput';
import { useLoadingBar } from 'shared/LoadingBar';

export function WhaleRadarWhalesWidget({
  className,
  headerActions,
}: {
  className?: string;
  headerActions?: ReactNode;
}) {
  const { t } = useTranslation('whale');
  const hasFlag = useHasFlag();

  const [tableProps, tableState, setTableState] = useTableState<
    Parameters<typeof useWhaleRadarWhales>[0]
  >('whales', {
    page: 1,
    pageSize: 5,
    networkNames: [],
    query: '',
  });

  const whales = useWhaleRadarWhales(tableState);
  useLoadingBar(whales.isFetching);

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
          <>
            <DebugPin title="?trading_pnl" color="orange" />
            {t('top_whales.trading_pnl.title')}
          </>,
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
        title: [
          <>
            <DebugPin title="?trading_pnl" color="orange" />
            {t('top_whales.returns.title')}
          </>,
          t('top_whales.returns.info'),
        ],
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
        title: (
          <>
            <DebugPin title="?win_lose" color="orange" />
            {t('top_whales.wins_losses')}
          </>
        ),
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
      className={clsx('min-h-[427px] mobile:min-h-[647px]', className)}
      title={<>{t('top_whales.title')}</>}
      loading={whales.isLoading}
      empty={whales.data?.length === 0}
      headerClassName="flex-wrap"
      headerActions={
        <>
          {headerActions ? (
            <div className="flex grow justify-end">{headerActions}</div>
          ) : (
            <div className="flex justify-between gap-4 mobile:gap-2">
              <SearchInput
                value={tableState.query}
                onChange={query => setTableState({ query })}
                placeholder={t('top_whales.search')}
                className="w-64 mobile:grow"
                size="md"
              />
              <NetworkSelect
                value={tableState.networkNames}
                valueType="name"
                filter="whale-radar"
                multiple
                allowClear
                size="md"
                onChange={networkNames => {
                  setTableState({
                    networkNames,
                    page: 1,
                  });
                }}
              />
            </div>
          )}
        </>
      }
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': 3,
          'pro+': 3,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={whales.data ?? []}
          rowKey="holder_address"
          {...tableProps}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
