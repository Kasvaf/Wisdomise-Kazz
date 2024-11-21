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
    undefined | 'hype' | 'popular_with_whales' | 'social_beloved'
  >(undefined);

  const columns = useMemo<Array<ColumnType<CoinSignal>>>(
    () => [
      {
        title: t('coin-details.tabs.hot_coins.table.name'),
        width: 300,
        render: (_, row) => <Coin coin={row.symbol} />,
      },
      {
        title: t('coin-details.tabs.hot_coins.table.price'),
        width: 300,
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
        enabled: signals.data?.length === 0,
        refreshButton: true,
        title: t('coin-details.tabs.hot_coins.empty.title'),
        subtitle: t('coin-details.tabs.hot_coins.empty.subtitle'),
      }}
      onRefresh={signals.refetch}
      refreshing={signals.isRefetching}
      id={id}
    >
      <div className="mb-2">
        <ButtonSelect
          className="mobile:w-full"
          options={[
            {
              label: t('coin-details.tabs.hot_coins.filters.all'),
              value: undefined,
            },
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
      </div>
      <ProLocker mode="table" level={3}>
        <Table
          columns={columns}
          dataSource={filteredCoins}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          tableLayout="fixed"
          pagination={{
            pageSize: 5,
          }}
        />
      </ProLocker>
    </OverviewWidget>
  );
}
