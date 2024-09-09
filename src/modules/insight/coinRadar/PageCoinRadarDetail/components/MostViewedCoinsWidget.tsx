import { useTranslation } from 'react-i18next';
import { type ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { type TrendingCoin, useTrendingCoins } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import Table from 'shared/Table';

export function MostViewedCoinsWidget(_: { slug?: string }) {
  const { t } = useTranslation('coin-radar');

  const coins = useTrendingCoins();

  const columns = useMemo<Array<ColumnType<TrendingCoin>>>(
    () => [
      {
        title: t('coin-details.tabs.most_viewed_coins.table.name'),
        render: (_, row) => <Coin coin={row.symbol} />,
      },
      {
        title: t('coin-details.tabs.most_viewed_coins.table.price'),
        render: (_, row) => <ReadableNumber value={row.price} label="$" />,
      },
      {
        title: t('coin-details.tabs.most_viewed_coins.table.chg_24'),
        render: (_, row) => (
          <PriceChange
            value={row.price_change_percentage_24h}
            className="inline-flex"
          />
        ),
      },
    ],
    [t],
  );

  return (
    <OverviewWidget title={t('coin-details.tabs.most_viewed_coins.title')}>
      <Table
        columns={columns}
        dataSource={coins.data?.slice(0, 5) ?? []}
        rowKey={row => JSON.stringify(row.symbol)}
        loading={coins.isLoading}
        pagination={false}
      />
    </OverviewWidget>
  );
}
