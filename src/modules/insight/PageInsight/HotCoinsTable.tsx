import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type TableColumnType } from 'antd';
import { type CoinSignal, useCoinSignals, useHasFlag } from 'api';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { SignalSentiment } from 'shared/SignalSentiment';
import { CoinSignalPnl } from 'shared/CoinSignalPnl';

export function HotCoinsTable() {
  const { t } = useTranslation('coin-radar');

  const signals = useCoinSignals({
    meta: {
      windowHours: 24,
    },
  });

  const hasFlag = useHasFlag();

  const columns = useMemo<Array<TableColumnType<CoinSignal>>>(
    () => [
      {
        title: t('hot-coins-section.table.name'),
        render: (_, row) => <Coin coin={row.symbol} />,
      },
      {
        colSpan: hasFlag('/insight/coin-radar?side-suggestion') ? 1 : 0,
        title: t('hot-coins-section.table.sentiment'),
        render: (_, row) => <SignalSentiment signal={row} />,
      },
      {
        title: t('hot-coins-section.table.call-time'),
        render: (_, row) => (
          <ReadableDate value={row.first_signal_related_at} />
        ),
      },
      {
        title: t('hot-coins-section.table.pnl'),
        sorter: (a, b) =>
          (a.signals_analysis?.real_pnl_percentage ?? 0) -
          (b.signals_analysis?.real_pnl_percentage ?? 0),
        render: (row: CoinSignal) => (
          <CoinSignalPnl signalAnalysis={row.signals_analysis} />
        ),
      },
      {
        title: t('hot-coins-section.table.realtime-price'),
        render: (_, row) => (
          <ReadableNumber value={row.current_price} label="usdt" />
        ),
      },
      {
        title: t('hot-coins-section.table.chg-24'),
        render: (_, row) => (
          <PriceChange
            value={row.price_change_percentage ?? 0}
            className="inline-flex"
          />
        ),
      },
    ],
    [t, hasFlag],
  );

  return (
    <Table
      loading={signals.isLoading}
      columns={columns}
      dataSource={signals.data?.slice(0, 6) ?? []}
      rowKey="symbol_name"
      pagination={false}
    />
  );
}
