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

  const filters = useMemo(() => {
    const list = coins.data ?? [];
    return [...new Set(list.flatMap(x => x.symbol_labels ?? []))].sort(
      (a, b) => a.length - b.length,
    );
  }, [coins]);

  const [filter, setFilter] = useState<undefined | string>(undefined);

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

  const filteredCoins = useMemo(
    () =>
      (coins.data ?? []).filter(row =>
        filter ? (row.symbol_labels ?? []).includes(filter) : true,
      ),
    [filter, coins],
  );

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
            ...filters.map(label => ({
              label: (
                <span className="capitalize">{label.split('_').join(' ')}</span>
              ),
              value: label,
            })),
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
