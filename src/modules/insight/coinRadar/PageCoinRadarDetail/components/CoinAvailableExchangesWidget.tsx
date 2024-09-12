import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { type CoinExchange, useCoinOverview } from 'api';
import Table from 'shared/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { OverviewWidget } from 'shared/OverviewWidget';

type ExtendedCoinExchange = CoinExchange & {
  id: string;
  pair_name: string;
  price?: number | null;
  price_label: string;
  rank: number;
};

export function CoinAvailableExchangesWidget({
  slug,
  id,
}: {
  slug: string;
  id?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinOverview({ slug });

  const data = useMemo<ExtendedCoinExchange[]>(() => {
    if (!coinOverview.data) return [];
    let resp: ExtendedCoinExchange[] = [];
    let rank = 1;
    for (const exchange of coinOverview.data?.exchanges ?? []) {
      resp = [
        ...resp,
        {
          ...exchange,
          id: `${exchange.exchange.id}-usd`,
          pair_name: `${coinOverview.data.symbol.abbreviation.toUpperCase()}/USD`,
          price: exchange.price_in_usd,
          price_label: '$',
          rank: rank++,
        },
        {
          ...exchange,
          id: `${exchange.exchange.id}-btc`,
          pair_name: `${coinOverview.data.symbol.abbreviation.toUpperCase()}/BTC`,
          price: exchange.price_in_btc,
          price_label: 'BTC',
          rank: rank++,
        },
      ];
    }
    return resp;
  }, [coinOverview.data]);

  const columns = useMemo<Array<ColumnType<ExtendedCoinExchange>>>(
    () => [
      {
        title: t('available-exchanges.table.rank'),
        sorter: (a, b) => (a.rank ?? 0) - (b.rank ?? 0),
        render: (_, row) => row.rank,
      },
      {
        title: t('available-exchanges.table.exchange'),
        render: (_, row) => (
          <div className="inline-flex items-center gap-2 whitespace-nowrap">
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
        title: t('available-exchanges.table.pair'),
        render: (_, row) => row.pair_name,
      },
      {
        title: t('available-exchanges.table.price'),
        render: (_, row) => (
          <ReadableNumber value={row.price} label={row.price_label} />
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

  return (
    <OverviewWidget
      id={id}
      title={t('coin-details.tabs.markets.title')}
      subtitle={t('coin-details.tabs.markets.subtitle')}
      loading={coinOverview.isLoading}
      empty={data.length === 0}
      contentClassName="!min-h-[300px]"
    >
      <Table
        loading={coinOverview.isLoading}
        columns={columns}
        dataSource={data}
        rowKey={row => row.id}
      />
    </OverviewWidget>
  );
}
