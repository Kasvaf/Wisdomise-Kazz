import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useCoinDetails } from 'api';
import Table from 'shared/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { type CoinExchange } from 'api/types/shared';

export function CoinExchangesWidget({
  slug,
  id,
  hr,
  className,
}: {
  slug: string;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinDetails({ slug });
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

  if (
    (coinOverview.data?.exchanges ?? []).length === 0 &&
    !coinOverview.isLoading
  )
    return null;

  return (
    <>
      <div
        id={id}
        title={t('coin-details.tabs.markets.title')}
        className={clsx(className)}
      >
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-sm font-semibold">
            {t('coin-details.tabs.markets.title')}
          </h3>
          <Input
            type="string"
            size="md"
            value={query}
            onChange={setQuery}
            className="mb-4 w-72 text-sm mobile:w-full"
            prefixIcon={<Icon name={bxSearch} />}
            placeholder={t('available-exchanges.search')}
            surface={2}
          />
        </div>
        <Table
          loading={coinOverview.isLoading}
          columns={columns}
          dataSource={data}
          rowKey={row => row.exchange.id}
          tableLayout="fixed"
          pagination={{
            pageSize: 5,
          }}
          surface={1}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
