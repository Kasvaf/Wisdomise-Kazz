import { type FC, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { Tooltip } from 'antd';
import { useHasFlag, type CoinSignal } from 'api';
import Table from 'modules/shared/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import { CoinSignalPnl } from 'shared/CoinSignalPnl';
import { ReadableDate } from 'shared/ReadableDate';
import { SignalSentiment } from 'shared/SignalSentiment';
import { InformativePrice } from 'shared/InformativePrice';
import Icon from 'shared/Icon';

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
        render: (row: CoinSignal) => <Coin coin={row.symbol} />,
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
        title: (
          <span className="inline-flex items-center gap-1">
            {t('hot-coins-section.table.call-time')}
            <Tooltip title={t('hot-coins-section.table.call-time-info')}>
              <Icon name={bxInfoCircle} size={16} />
            </Tooltip>
          </span>
        ),
        sorter: (a, b) =>
          new Date(a.first_signal_related_at ?? Date.now()).getTime() -
          new Date(b.first_signal_related_at ?? Date.now()).getTime(),
        render: (row: CoinSignal) => (
          <ReadableDate value={row.first_signal_related_at} />
        ),
      },
      {
        title: (
          <span className="inline-flex items-center gap-1">
            {t('hot-coins-section.table.pnl')}
            {false && (
              <Tooltip title={t('hot-coins-section.table.pnl-info')}>
                <Icon name={bxInfoCircle} size={16} />
              </Tooltip>
            )}
          </span>
        ),
        sorter: (a, b) =>
          (a.signals_analysis?.real_pnl_percentage ?? 0) -
          (b.signals_analysis?.real_pnl_percentage ?? 0),
        render: (row: CoinSignal) => (
          <CoinSignalPnl signalAnalysis={row.signals_analysis} />
        ),
      },
      {
        className: 'w-36',
        title: t('hot-coins-section.table.realtime-price'),
        sorter: (a, b) => (a.current_price ?? 0) - (b.current_price ?? 0),
        render: (row: CoinSignal) => (
          <InformativePrice
            price={row.current_price}
            priceChange={row.price_change_percentage}
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
