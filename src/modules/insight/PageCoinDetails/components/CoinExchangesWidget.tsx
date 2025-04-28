import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import { bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useCoinDetails } from 'api';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { type CoinExchange } from 'api/types/shared';
import useIsMobile from 'utils/useIsMobile';

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
  const isMobile = useIsMobile();

  const columns = useMemo<Array<TableColumn<CoinExchange>>>(
    () => [
      {
        title: t('available-exchanges.table.exchange'),
        width: '45%',
        sticky: 'start',
        render: row => (
          <div className="inline-flex items-center gap-2 text-xs leading-tight">
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
        render: row => (
          <ReadableNumber
            value={row.price_in_usd}
            label="usdt"
            className="text-xs"
          />
        ),
      },
      {
        title: t('available-exchanges.table.volume_24h'),
        sorter: (a, b) => (a.volume_24h ?? 0) - (b.volume_24h ?? 0),
        render: row => (
          <ReadableNumber
            value={row.volume_24h}
            label="$"
            className="text-xs"
          />
        ),
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

  if ((coinOverview.data?.exchanges ?? []).length === 0) return null;

  return (
    <>
      <div
        id={id}
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-sm font-semibold">
            {t('coin-details.tabs.markets.title')}
          </h3>
          <Input
            type="string"
            size={isMobile ? 'xs' : 'md'}
            value={query}
            onChange={setQuery}
            className="w-72 text-sm mobile:w-48"
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
          surface={2}
          scrollable
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
