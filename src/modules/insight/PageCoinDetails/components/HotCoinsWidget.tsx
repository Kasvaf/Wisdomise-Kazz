import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { type SocialRadarCoin, useSocialRadarCoins } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { AccessShield } from 'shared/AccessShield';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

export function HotCoinsWidget({ id }: { slug?: string; id?: string }) {
  const { t } = useTranslation('coin-radar');
  const [filter, setFilter] = useState<undefined | string>(undefined);
  const coins = useSocialRadarCoins({
    windowHours: 24,
    trendLabels: filter ? [filter] : [],
  });

  const filters = useMemo(() => {
    const list = coins.data ?? [];
    return [...new Set(list.flatMap(x => x.symbol_labels ?? []))].sort(
      (a, b) => a.length - b.length,
    );
  }, [coins]);

  const columns = useMemo<Array<ColumnType<SocialRadarCoin>>>(
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

  return (
    <OverviewWidget
      contentClassName="flex flex-col gap-4"
      title={t('coin-details.tabs.hot_coins.title')}
      loading={coins.isInitialLoading}
      empty={{
        enabled: coins.data?.length === 0,
        refreshButton: true,
        title: t('coin-details.tabs.hot_coins.empty.title'),
        subtitle: t('coin-details.tabs.hot_coins.empty.subtitle'),
      }}
      onRefresh={coins.refetch}
      refreshing={coins.isRefetching}
      id={id}
    >
      <div className="mb-2">
        <ButtonSelect
          className="inline-block mobile:w-full"
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
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'free': true,
          'trial': 3,
          'pro': false,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={coins.data}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          tableLayout="fixed"
          pagination={{
            pageSize: 5,
          }}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
