import { type FC, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { useHasFlag, type CoinSignal } from 'api';
import Table from 'modules/shared/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReadableDate } from 'shared/ReadableDate';
import PriceChange from 'shared/PriceChange';
import { Coin } from 'shared/Coin';
import { SignalSentiment } from './SignalSentiment';

export const HotCoinsTable: FC<{
  loading?: boolean;
  dataSource?: CoinSignal[];
}> = ({ loading, dataSource }) => {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();

  const columns = useMemo<Array<ColumnType<CoinSignal>>>(
    () => [
      {
        className: 'w-14',
        title: t('hot-coins-section.table.rank'),
        sorter: (a, b) => a.rank - b.rank,
        render: row => row.rank,
      },
      {
        className: 'w-36',
        title: t('hot-coins-section.table.name'),
        render: (row: CoinSignal) => (
          <Coin abbrevation={row.symbol_name} image={row.image} />
        ),
      },
      ...(hasFlag('/insight/coin-radar?side-suggestion')
        ? [
            {
              title: t('hot-coins-section.table.sentiment'),
              sorter: (a: CoinSignal, b: CoinSignal) =>
                (a.gauge_measure ?? 0) - (b.gauge_measure ?? 0),
              render: (row: CoinSignal) => <SignalSentiment signal={row} />,
            },
          ]
        : []),
      {
        className: 'w-36',
        title: t('hot-coins-section.table.realtime-price'),
        sorter: (a, b) => (a.current_price ?? 0) - (b.current_price ?? 0),
        render: (row: CoinSignal) => (
          <ReadableNumber value={row.current_price} label="usdt" />
        ),
      },
      {
        title: t('hot-coins-section.table.call-time'),
        sorter: (a, b) =>
          new Date(a.first_signal_related_at ?? Date.now()).getTime() -
          new Date(b.first_signal_related_at ?? Date.now()).getTime(),
        render: (row: CoinSignal) => (
          <ReadableDate value={row.first_signal_related_at} />
        ),
      },
      {
        className: 'w-32',
        title: t('hot-coins-section.table.chg-24'),
        sorter: (a, b) =>
          (a.price_change_percentage ?? 0) - (b.price_change_percentage ?? 0),
        render: (row: CoinSignal) => (
          <PriceChange
            value={row.price_change_percentage ?? 0}
            className="inline-flex"
          />
        ),
      },
      {
        title: t('hot-coins-section.table.24h-voume'),
        sorter: (a, b) => (a.total_volume ?? 0) - (b.total_volume ?? 0),
        render: (row: CoinSignal) => (
          <ReadableNumber value={row.total_volume} label="$" />
        ),
      },
      {
        title: t('hot-coins-section.table.market-cap'),
        sorter: (a, b) => (a.market_cap ?? 0) - (b.market_cap ?? 0),
        render: (row: CoinSignal) => (
          <ReadableNumber value={row.market_cap} label="$" />
        ),
      },
      {
        title: t('hot-coins-section.table.tvl'),
        sorter: (a, b) =>
          (a.circulating_supply ?? 0) - (b.circulating_supply ?? 0),
        render: (row: CoinSignal) => (
          <ReadableNumber value={row.circulating_supply} />
        ),
      },
    ],
    [t, hasFlag],
  );

  return (
    <Table
      className="whitespace-nowrap mobile:min-w-max"
      columns={columns}
      dataSource={dataSource}
      rowKey={row => row.symbol_name}
      loading={loading}
    />
  );
};
