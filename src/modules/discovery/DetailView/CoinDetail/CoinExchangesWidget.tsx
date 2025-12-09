import { bxSearch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinExchange, useCoinDetails } from 'services/rest/discovery';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { useUnifiedCoinDetails } from './lib';

export function CoinExchangesWidget({
  id,
  hr,
  title,
  limit: _limit = 6,
  className,
}: {
  id?: string;
  hr?: boolean;
  title?: boolean;
  limit?: number;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const { symbol } = useUnifiedCoinDetails();
  const { data: rawData } = useCoinDetails({ slug: symbol.slug });
  const exchanges = rawData?.exchanges;
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState<number | undefined>(_limit);

  const columns = useMemo<Array<TableColumn<CoinExchange>>>(
    () => [
      {
        title: t('available-exchanges.table.exchange'),
        width: '45%',
        sticky: 'start',
        render: row => (
          <div className="inline-flex items-center gap-2 text-xs leading-tight">
            <img
              alt={row.exchange.name}
              className="h-6 w-6 rounded-full bg-white object-scale-down p-1"
              src={row.exchange.icon_url}
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
            className="text-xs"
            label="usdt"
            value={row.price_in_usd}
          />
        ),
      },
      {
        title: t('available-exchanges.table.volume_24h'),
        sorter: (a, b) => (a.volume_24h ?? 0) - (b.volume_24h ?? 0),
        render: row => (
          <ReadableNumber
            className="text-xs"
            label="$"
            value={row.volume_24h}
          />
        ),
      },
    ],
    [t],
  );

  const data = useMemo(
    () =>
      (exchanges ?? []).filter(row =>
        row.exchange.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [exchanges, query],
  );

  if ((exchanges ?? []).length === 0) return null;

  return (
    <>
      <div
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
        id={id}
      >
        <div className="flex items-center justify-between gap-1">
          {title !== false && (
            <h3 className="font-semibold text-sm">
              {t('coin-details.tabs.markets.title')}
            </h3>
          )}
          <Input
            className="w-72 text-sm max-md:w-48"
            onChange={setQuery}
            placeholder={t('available-exchanges.search')}
            prefixIcon={<Icon name={bxSearch} />}
            size="xs"
            surface={1}
            type="string"
            value={query}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data.slice(0, limit)}
          footer={
            typeof limit === 'number' &&
            (data?.length ?? 0) > limit && (
              <Button
                onClick={() => setLimit(undefined)}
                size="xs"
                variant="link"
              >
                {t('common:load-more')}
              </Button>
            )
          }
          rowKey={row => row.exchange.id}
          scrollable
          surface={1}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
