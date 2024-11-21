import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { type CoinSignal, useCoinSignals } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ProLocker } from 'shared/ProLocker';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ButtonSelect } from 'shared/ButtonSelect';

export function HotCoinsWidget({ id }: { slug?: string; id?: string }) {
  const { t } = useTranslation('coin-radar');
  const signals = useCoinSignals();
  const coins = useCoinSignals({
    windowHours: 24,
  });
  const [filter, setFilter] = useState<
    'hype' | 'popular_with_whales' | 'social_beloved'
  >('hype');

  const columns = useMemo<Array<ColumnType<CoinSignal>>>(
    () => [
      {
        title: t('coin-details.tabs.hot_coins.table.name'),
        render: (_, row) => <Coin coin={row.symbol} />,
      },
      {
        title: t('coin-details.tabs.hot_coins.table.price'),
        render: (_, row) => (
          <ReadableNumber value={row.symbol_market_data.current_price} />
        ),
      },
      {
        title: t('coin-details.tabs.hot_coins.table.24h_chg'),
        render: (_, row) => (
          <DirectionalNumber
            value={row.symbol_market_data.price_change_percentage_24h}
            label="%"
            showIcon={false}
            showSign
          />
        ),
      },
    ],
    [t],
  );

  const filteredCoins = useMemo(() => {
    return (coins.data ?? [])
      .filter(row => {
        const labels = row.symbol_labels ?? [];
        if (filter === 'social_beloved') {
          return (
            labels.includes('weekly_social_beloved') ||
            labels.includes('monthly_social_beloved')
          );
        }
        if (filter === 'hype') {
          return labels.includes('hype');
        }
        return true;
      })
      .slice(2);
  }, [coins.data, filter]);

  return (
    <OverviewWidget
      contentClassName="flex flex-col gap-4"
      title={t('coin-details.tabs.hot_coins.title')}
      loading={signals.isInitialLoading}
      empty={{
        enabled: filteredCoins?.length === 0,
        refreshButton: true,
      }}
      onRefresh={signals.refetch}
      refreshing={signals.isRefetching}
      id={id}
      headerActions={
        <ButtonSelect
          options={[
            {
              label: t('coin-details.tabs.hot_coins.filters.hype'),
              value: 'hype',
            },
            {
              label: t(
                'coin-details.tabs.hot_coins.filters.popular_with_whales',
              ),
              value: 'popular_with_whales',
              hidden: true,
            },
            {
              label: t('coin-details.tabs.hot_coins.filters.social_beloved'),
              value: 'social_beloved',
            },
          ]}
          value={filter}
          onChange={setFilter}
        />
      }
    >
      <ProLocker mode="table" level={3}>
        <Table
          columns={columns}
          dataSource={filteredCoins}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          tableLayout="fixed"
        />
      </ProLocker>
    </OverviewWidget>
  );
}
