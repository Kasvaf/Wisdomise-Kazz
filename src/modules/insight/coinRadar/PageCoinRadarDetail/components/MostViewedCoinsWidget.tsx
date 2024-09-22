import { useTranslation } from 'react-i18next';
import { type ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { type TrendingCoin, useTrendingCoins } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { Coin } from 'shared/Coin';
import Table from 'shared/Table';
import { InformativePrice } from 'shared/InformativePrice';

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
        render: (_, row) => (
          <InformativePrice
            price={row.price}
            priceChange={row.price_change_percentage_24h}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <OverviewWidget
      title={t('coin-details.tabs.most_viewed_coins.title')}
      loading={coins.isLoading}
      empty={coins.data?.length === 0}
    >
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
