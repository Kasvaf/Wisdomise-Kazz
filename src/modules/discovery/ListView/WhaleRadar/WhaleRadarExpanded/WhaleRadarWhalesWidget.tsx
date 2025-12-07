import { useHasFlag } from 'api';
import { useWhaleRadarWhales, type WhaleShort } from 'api/discovery';
import { clsx } from 'clsx';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { DebugPin } from 'shared/DebugPin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { Network } from 'shared/Network';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import { SearchInput } from 'shared/SearchInput';
import { usePageState } from 'shared/usePageState';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Wallet } from 'shared/v1-components/Wallet';

export function WhaleRadarWhalesWidget({
  className,
  headerActions,
}: {
  className?: string;
  headerActions?: ReactNode;
}) {
  const { t } = useTranslation('whale');
  const hasFlag = useHasFlag();

  const [tableState, setTableState] = usePageState<
    Parameters<typeof useWhaleRadarWhales>[0]
  >('whale-radar-whales', {
    networkNames: [],
    query: '',
  });

  const whales = useWhaleRadarWhales(tableState);
  useLoadingBadge(whales.isFetching);

  const columns = useMemo<Array<TableColumn<WhaleShort>>>(
    () => [
      {
        title: t('top_whales.address'),
        sticky: 'start',
        width: 180,
        render: row => <Wallet address={row.holder_address} />,
      },
      {
        title: t('top_whales.network'),
        width: 100,
        render: row => (
          <Network
            imageClassName="size-4"
            network={{
              name: row.network_name,
              icon_url: row.network_icon_url,
            }}
          />
        ),
      },
      {
        title: t('top_whales.balance.title'),
        info: t('top_whales.balance.info'),
        width: 120,
        align: 'end',
        key: 'balance_usdt',
        sorter: (a, b) => (a.balance_usdt ?? 0) - (b.balance_usdt ?? 0),
        render: row => (
          <ReadableNumber label="$" popup="never" value={row.balance_usdt} />
        ),
      },
      {
        title: t('top_whales.trading_volume.title'),
        info: t('top_whales.trading_volume.info'),
        width: 150,
        align: 'end',
        render: row => (
          <ReadableNumber
            label="$"
            popup="never"
            value={row.recent_trading_volume}
          />
        ),
      },
      // {
      //   title: t('top_whales.tokens'),
      //   align: 'end',
      //   width: 100,
      //   render: row => <Tokens coins={row.top_assets.map(r => r.symbol)} />,
      // },
      {
        title: (
          <>
            <DebugPin color="orange" title="/discovery?whale_trading_pnl" />
            {t('top_whales.trading_pnl.title')}
          </>
        ),
        width: 150,
        info: t('top_whales.trading_pnl.info'),
        hidden: !hasFlag('/discovery?whale_trading_pnl'),
        align: 'end',
        sorter: (a, b) =>
          (a.recent_trading_pnl ?? 0) - (b.recent_trading_pnl ?? 0),
        render: row => (
          <DirectionalNumber
            label="$"
            showSign
            value={row.recent_trading_pnl}
          />
        ),
      },
      {
        title: (
          <>
            <DebugPin color="orange" title="/discovery?whale_trading_pnl" />
            {t('top_whales.returns.title')}
          </>
        ),
        width: 150,
        info: t('top_whales.returns.info'),
        align: 'end',
        sorter: (a, b) =>
          (a.recent_trading_pnl_percentage ?? 0) -
          (b.recent_trading_pnl_percentage ?? 0),
        hidden: !hasFlag('/discovery?whale_trading_pnl'),
        render: row => (
          <DirectionalNumber
            label="%"
            showSign
            value={row.recent_trading_pnl_percentage}
          />
        ),
      },
      {
        title: (
          <>
            <DebugPin color="orange" title="/discovery?whale_win_lose" />
            {t('top_whales.wins_losses')}
          </>
        ),
        width: 100,
        align: 'end',
        hidden: !hasFlag('/discovery?whale_win_lose'),
        render: row => (
          <div>
            <ReadableNumber value={row.recent_trading_wins ?? 0} />
            <span>/</span>
            <ReadableNumber value={row.recent_trading_losses ?? 0} />
          </div>
        ),
      },
      {
        title: t('top_whales.buy_sell'),
        align: 'end',
        render: row => (
          <div>
            <ReadableNumber
              className="text-v1-content-positive"
              value={row.recent_total_buys}
            />
            <span className="text-v1-content-secondary">/</span>
            <ReadableNumber
              className="text-v1-content-negative"
              value={row.recent_total_sells}
            />
          </div>
        ),
      },
      {
        title: t('top_whales.trading_holding'),
        align: 'end',
        render: row => (
          <div>
            <ReadableNumber value={row.total_trading_assets ?? 0} />
            <span>/</span>
            <ReadableNumber value={row.total_holding_assets ?? 0} />
          </div>
        ),
      },
      {
        title: t('top_whales.trades_per_day.title'),
        info: t('top_whales.trades_per_day.info'),
        align: 'end',
        render: row => (
          <ReadableNumber
            popup="never"
            value={row?.recent_average_trades_per_day}
          />
        ),
      },
    ],
    [hasFlag, t],
  );

  return (
    <OverviewWidget
      className={clsx('min-h-[427px] max-md:min-h-[647px]', className)}
      empty={whales.data?.length === 0}
      headerActions={
        headerActions ? (
          <div className="flex grow justify-end">{headerActions}</div>
        ) : (
          <div className="flex justify-between gap-4 max-md:gap-2">
            <SearchInput
              className="w-64 max-md:grow"
              onChange={query => setTableState({ query })}
              placeholder={t('top_whales.search')}
              size="xs"
              value={tableState.query}
            />
          </div>
        )
      }
      headerClassName="flex-wrap"
      title={t('top_whales.title')}
    >
      <AccessShield
        mode="table"
        sizes={{
          guest: false,
          initial: false,
          free: false,
          vip: false,
        }}
      >
        <Table
          className="max-h-[485px]"
          columns={columns}
          dataSource={whales.data ?? []}
          loading={whales.isLoading}
          rowKey={r => r.holder_address}
          scrollable
        />
      </AccessShield>
    </OverviewWidget>
  );
}
