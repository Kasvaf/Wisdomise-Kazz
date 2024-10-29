import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useWhalesCoins, type WhaleCoin } from 'api';
import { Coin } from 'shared/Coin';
import Table from 'shared/Table';
import { OverviewWidget } from 'shared/OverviewWidget';
import { InformativePrice } from 'shared/InformativePrice';
import { ProLocker } from 'shared/ProLocker';

export function WhalePopularCoinsWidget(_: { slug: string }) {
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
          <InformativePrice
            price={row.market_data.current_price}
            priceChange={row.market_data.price_change_percentage_24h}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <OverviewWidget
      title={t('coin-details.tabs.whale_popular.title')}
      loading={coins.isLoading}
      empty={coins.data?.results.length === 0}
    >
      <ProLocker mode="table" level={2}>
        <Table
          columns={columns}
          dataSource={coins.data?.results}
          rowKey={row => JSON.stringify(row.symbol)}
          loading={coins.isLoading}
          pagination={false}
        />
      </ProLocker>
    </OverviewWidget>
  );
}
