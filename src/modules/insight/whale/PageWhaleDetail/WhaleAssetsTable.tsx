import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { type SingleWhale } from 'api';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';

export function WhaleAssetsTable({
  className,
  whale,
}: {
  className?: string;
  whale?: SingleWhale;
}) {
  const { t } = useTranslation('whale');

  const columns = useMemo<Array<ColumnType<SingleWhale['assets_details'][0]>>>(
    () => [
      {
        title: t('sections.whale-coins.table.asset'),
        dataIndex: 'symbol_abbreviation',
        render: (_, row) => <Coin coin={row.symbol} />,
      },
      {
        title: t('sections.whale-coins.table.amount'),
        dataIndex: 'amount',
        sorter: (a, b) => a.amount - b.amount,
        render: (_, row) => <ReadableNumber value={row.amount} />,
      },
      {
        title: t('sections.whale-coins.table.worth'),
        dataIndex: 'worth',
        sorter: (a, b) => (a.worth ?? 0) - (b.worth ?? 0),
        render: (_, row) => (
          <ReadableNumber
            value={row.worth !== undefined && row.worth > 0 ? row.worth : null}
            label="usdt"
          />
        ),
      },
      {
        title: t('sections.whale-coins.table.price'),
        sorter: (a, b) =>
          (a.market_data?.current_price ?? 0) -
          (b.market_data?.current_price ?? 0),
        render: (_, row) => (
          <ReadableNumber value={row.market_data?.current_price} label="usdt" />
        ),
      },
      {
        title: t('sections.whale-coins.table.pnl'),
        sorter: (a, b) =>
          (a.last_30_days_trading_pnl_percentage ?? 0) -
          (b.last_30_days_trading_pnl_percentage ?? 0),
        render: (_, row) => (
          <PriceChange
            className="inline-flex"
            value={
              row.worth !== undefined && row.worth > 0
                ? row.last_30_days_trading_pnl_percentage
                : null
            }
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className={clsx('-mx-6 overflow-auto px-6', className)}>
      <Table
        columns={columns}
        dataSource={whale?.assets_details ?? []}
        loading={!whale}
        rowKey="symbol_abbreviation"
        tableLayout="fixed"
      />
    </div>
  );
}
