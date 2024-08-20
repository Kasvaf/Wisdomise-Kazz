import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type TableColumnType } from 'antd';
import { useWhales, type WhaleShort } from 'api';
import Table from 'shared/Table';
import { WalletAddress } from 'shared/WalletAddress';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';

export function TopWhaleListTable() {
  const { t } = useTranslation('whale');

  const whales = useWhales({
    page: 1,
    pageSize: 5,
  });

  const columns = useMemo<Array<TableColumnType<WhaleShort>>>(
    () => [
      {
        title: t('sections.top-whales.table.wallet-address'),
        render: (_, row) => (
          <WalletAddress
            address={row.holder_address}
            network={row.network_name}
          />
        ),
      },
      {
        title: t('sections.top-whales.table.pnl_percent'),
        render: (_, row) => (
          <PriceChange value={row.last_30_days_trading_pnl_percentage} />
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
          <ReadableNumber value={row.total_last_30_days_transfers} />
        ),
      },
    ],
    [t],
  );

  return (
    <Table
      loading={whales.isLoading}
      columns={columns}
      dataSource={whales.data?.results.slice(0, 6) ?? []}
      rowKey="holder_address"
      pagination={false}
    />
  );
}
