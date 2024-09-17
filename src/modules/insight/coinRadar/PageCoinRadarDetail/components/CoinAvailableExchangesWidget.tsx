import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { bxSearch } from 'boxicons-quasar';
import { type CoinExchange, useCoinOverview } from 'api';
import Table from 'shared/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { OverviewWidget } from 'shared/OverviewWidget';
import TextBox from 'shared/TextBox';
import Icon from 'shared/Icon';

export function CoinAvailableExchangesWidget({
  slug,
  id,
}: {
  slug: string;
  id?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinOverview({ slug });
  const [query, setQuery] = useState('');

  const columns = useMemo<Array<ColumnType<CoinExchange>>>(
    () => [
      {
        title: t('available-exchanges.table.exchange'),
        width: '45%',
        render: (_, row) => (
          <div className="inline-flex items-center gap-2 leading-tight">
            <img
              src={row.exchange.icon_url}
              alt={row.exchange.name}
              className="h-6 w-6 rounded-full bg-white object-scale-down p-1"
            />
            <p>{row.exchange.name}</p>
          </div>
        ),
      },
      {
        title: t('available-exchanges.table.price'),
        sorter: (a, b) => (a.price_in_usd ?? 0) - (b.price_in_usd ?? 0),
        render: (_, row) => (
          <ReadableNumber value={row.price_in_usd} label="usdt" />
        ),
      },
      {
        title: t('available-exchanges.table.volume_24h'),
        sorter: (a, b) => (a.volume_24h ?? 0) - (b.volume_24h ?? 0),
        render: (_, row) => <ReadableNumber value={row.volume_24h} label="$" />,
      },
    ],
    [t],
  );

  const data = useMemo(
    () =>
      (coinOverview.data?.exchanges ?? []).filter(row =>
        row.exchange.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [coinOverview.data?.exchanges, query],
  );

  return (
    <OverviewWidget
      id={id}
      title={t('coin-details.tabs.markets.title')}
      subtitle={t('coin-details.tabs.markets.subtitle')}
      loading={coinOverview.isLoading}
      empty={data.length === 0}
      headerActions={
        <TextBox
          value={query}
          onChange={setQuery}
          className="text-sm mobile:w-full"
          suffix={<Icon name={bxSearch} />}
          placeholder={t('available-exchanges.search')}
          disabled={(coinOverview.data?.exchanges ?? []).length === 0}
        />
      }
      headerClassName="flex-wrap"
    >
      <Table
        loading={coinOverview.isLoading}
        columns={columns}
        dataSource={data}
        rowKey={row => row.exchange.id}
        tableLayout="fixed"
      />
    </OverviewWidget>
  );
}
