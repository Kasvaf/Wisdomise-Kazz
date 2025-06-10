import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

import { OverviewWidget } from 'shared/OverviewWidget';
import { useHasFlag } from 'api';
import { useWhaleRadarWhales, type WhaleShort } from 'api/discovery';
import { Network } from 'shared/Network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coins } from 'shared/Coins';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { AccessShield } from 'shared/AccessShield';
import { DebugPin } from 'shared/DebugPin';
import { SearchInput } from 'shared/SearchInput';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { usePageState } from 'shared/usePageState';
import { Wallet } from 'modules/discovery/DetailView/WhaleDetail/Wallet';

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
        render: row => (
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
        width: 100,
        render: row => (
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
        title: t('top_whales.balance.title'),
        info: t('top_whales.balance.info'),
        width: 120,
        align: 'end',
        key: 'balance_usdt',
        sorter: (a, b) => (a.balance_usdt ?? 0) - (b.balance_usdt ?? 0),
        render: row => (
          <ReadableNumber label="$" value={row.balance_usdt} popup="never" />
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
            value={row.recent_trading_volume}
            popup="never"
          />
        ),
      },
      {
        title: t('top_whales.tokens'),
        align: 'end',
        width: 100,
        render: row => <Coins coins={row.top_assets.map(r => r.symbol)} />,
      },
      {
        title: (
          <>
            <DebugPin title="/discovery?whale_trading_pnl" color="orange" />
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
            value={row.recent_trading_pnl}
            label="$"
            showSign
          />
        ),
      },
      {
        title: (
          <>
            <DebugPin title="/discovery?whale_trading_pnl" color="orange" />
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
            value={row.recent_trading_pnl_percentage}
            label="%"
            showSign
          />
        ),
      },
      {
        title: (
          <>
            <DebugPin title="/discovery?whale_win_lose" color="orange" />
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
            </div>
          )}
        </>
      }
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
          columns={columns}
          dataSource={whales.data ?? []}
          rowKey={r => r.holder_address}
          loading={whales.isLoading}
          className="max-h-[485px]"
          scrollable
        />
      </AccessShield>
    </OverviewWidget>
  );
}
