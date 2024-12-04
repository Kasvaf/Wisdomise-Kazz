import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type TableColumnType } from 'antd';
import { useHasFlag, useWhales, type WhaleShort } from 'api';
import Table from 'shared/Table';
import { Wallet } from 'shared/Wallet';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { OverviewWidget } from 'shared/OverviewWidget';
import { AccessSheild } from 'shared/AccessSheild';
import { SeeMoreLink } from './SeeMoreLink';

export function TopWhaleListWidget({ className }: { className?: string }) {
  const { t } = useTranslation('whale');
  const hasFlag = useHasFlag();
  const whales = useWhales({
    page: 1,
    pageSize: 6,
  });

  const columns = useMemo<Array<TableColumnType<WhaleShort>>>(
    () => [
      {
        title: t('sections.top-whales.table.wallet-address'),
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
        title: t('sections.top-whales.table.pnl_percent'),
        render: (_, row) => (
          <PriceChange value={row.recent_trading_pnl_percentage} />
        ),
      },
      {
        title: t('sections.top-whales.table.total_worth'),
        render: (_, row) => (
          <ReadableNumber value={row.balance_usdt} label="usdt" />
        ),
      },
      {
        title: t('sections.top-whales.table.trades'),
        render: (_, row) => (
          <ReadableNumber
            value={
              row.recent_trading_wins ?? 0 ?? row.recent_trading_losses ?? 0
            }
          />
        ),
      },
    ],
    [t],
  );

  if (!hasFlag('/coin-radar/whale-radar')) return null;

  return (
    <OverviewWidget
      className={className}
      title={t('whale:sections.top-whales.title')}
      info={t('whale:sections.top-whales.subtitle')}
      headerActions={<SeeMoreLink to="/coin-radar/whale-radar" />}
      loading={whales.isLoading}
      empty={whales.data?.results.length === 0}
    >
      <AccessSheild mode="table" level={2} size={2}>
        <Table
          loading={whales.isLoading}
          columns={columns}
          dataSource={whales.data?.results ?? []}
          rowKey="holder_address"
          pagination={false}
        />
      </AccessSheild>
    </OverviewWidget>
  );
}
