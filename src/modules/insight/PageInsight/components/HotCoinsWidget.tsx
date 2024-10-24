import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Tooltip, type TableColumnType } from 'antd';
import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import { type CoinSignal, useCoinSignals, useHasFlag } from 'api';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { ReadableDate } from 'shared/ReadableDate';
import { SignalSentiment } from 'shared/SignalSentiment';
import { CoinSignalPnl } from 'shared/CoinSignalPnl';
import { OverviewWidget } from 'shared/OverviewWidget';
import { InformativePrice } from 'shared/InformativePrice';
import { RealtimeBadge } from 'modules/insight/coinRadar/PageCoinRadar/assets';
import Icon from 'shared/Icon';
import { ProGuard } from 'modules/base/auth/pro/ProGuard';
import { SeeMoreLink } from './SeeMoreLink';

export function HotCoinsWidget({ className }: { className?: string }) {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();
  const signals = useCoinSignals();

  const columns = useMemo<Array<TableColumnType<CoinSignal>>>(
    () => [
      {
        title: t('hot-coins-section.table.rank'),
        render: (_, row) => row.rank,
      },
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
        title: (
          <span className="inline-flex items-center gap-1">
            {t('hot-coins-section.table.call-time')}
            <Tooltip title={t('hot-coins-section.table.call-time-info')}>
              <Icon name={bxInfoCircle} size={16} />
            </Tooltip>
          </span>
        ),
        render: (_, row) => (
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
        render: (row: CoinSignal) => (
          <CoinSignalPnl signalAnalysis={row.signals_analysis} />
        ),
      },
      {
        title: t('hot-coins-section.table.realtime-price'),
        render: (_, row) => (
          <InformativePrice
            price={row.current_price}
            priceChange={row.price_change_percentage}
          />
        ),
      },
    ],
    [t, hasFlag],
  );

  if (!hasFlag('/insight/coin-radar')) return null;

  return (
    <OverviewWidget
      title={
        <>
          {t('coin-radar:hot-coins-section.title')}
          <RealtimeBadge className="animate-pulse" />
        </>
      }
      headerActions={<SeeMoreLink to="/insight/coin-radar" />}
      className={clsx('min-h-[548px]', className)}
      loading={signals.isLoading}
      empty={signals.data?.length === 0}
    >
      <ProGuard mode="table" level={3}>
        <Table
          loading={signals.isLoading}
          columns={columns}
          dataSource={signals.data?.slice(0, 6) ?? []}
          rowKey="symbol_name"
          pagination={false}
        />
      </ProGuard>
    </OverviewWidget>
  );
}
