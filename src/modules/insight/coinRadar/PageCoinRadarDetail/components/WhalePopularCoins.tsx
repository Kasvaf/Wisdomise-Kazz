import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useWhalesCoins, type WhaleCoin } from 'api';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import Table from 'shared/Table';

export function WhalePopularCoins(_: { slug: string }) {
  const { t } = useTranslation('coin-radar');

  const coins = useWhalesCoins({
    page: 1,
    pageSize: 5,
    days: 1,
  });

  const columns = useMemo<Array<ColumnType<WhaleCoin>>>(
    () => [
      {
        title: t('hot-coins-section.table.name'),
        render: (_, row) => <Coin coin={row.symbol} />,
      },
      {
        title: t('hot-coins-section.table.realtime-price'),
        render: (_, row) => (
          <ReadableNumber value={row.market_data.current_price} label="usdt" />
        ),
      },
      {
        title: t('hot-coins-section.table.chg-24'),
        render: (_, row) => (
          <PriceChange
            value={row.market_data.price_change_percentage_24h ?? 0}
            className="inline-flex"
          />
        ),
      },
    ],
    [t],
  );

  return (
    <Table
      columns={columns}
      dataSource={coins.data?.results}
      rowKey={row => JSON.stringify(row.symbol)}
      loading={coins.isLoading}
      pagination={false}
    />
  );
}
