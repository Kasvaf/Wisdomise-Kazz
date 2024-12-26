import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type TableColumnType } from 'antd';
import { clsx } from 'clsx';
import { type CoinSignal, useCoinSignals, useHasFlag } from 'api';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReactComponent as RealtimeIcon } from 'modules/insight/coinRadar/PageCoinRadar/realtime.svg';
import { AccessSheild } from 'shared/AccessSheild';
import { CoinPriceInfo } from 'modules/insight/coinRadar/PageCoinRadar/components/CoinPriceInfo';
import { SignalSentiment } from '../../coinRadar/PageCoinRadar/components/SignalSentiment';
import { SeeMoreLink } from './SeeMoreLink';

export function HotCoinsWidget({ className }: { className?: string }) {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();
  const coins = useCoinSignals();

  const sortedCoins = useMemo(() => {
    return (coins.data ?? [])
      .sort((a, b) => {
        return (
          new Date(b.signals_analysis.call_time ?? Date.now()).getTime() -
          new Date(a.signals_analysis.call_time ?? Date.now()).getTime()
        );
      })
      .slice(0, 6);
  }, [coins]);

  const columns = useMemo<Array<TableColumnType<CoinSignal>>>(
    () => [
      {
        title: '#',
        render: (_, __, i) => i + 1,
      },
      {
        title: t('social-radar-overview.table.name'),
        render: (_, row) => <Coin coin={row.symbol} />,
      },
      {
        colSpan: hasFlag('/coin-radar/social-radar?side-suggestion') ? 1 : 0,
        title: t('social-radar-overview.table.sentiment'),
        render: (_, row) => <SignalSentiment signal={row} />,
      },
      {
        title: t('social-radar-overview.table.info'),
        render: (_, row) => (
          <CoinPriceInfo marketData={row.symbol_market_data} />
        ),
      },
    ],
    [t, hasFlag],
  );

  if (!hasFlag('/coin-radar/social-radar')) return null;

  return (
    <OverviewWidget
      title={
        <>
          {t('coin-radar:social-radar-overview.title')}
          <RealtimeIcon />
        </>
      }
      headerActions={<SeeMoreLink to="/coin-radar/social-radar" />}
      className={clsx('min-h-[548px]', className)}
      loading={coins.isLoading}
      empty={sortedCoins.length === 0}
    >
      <AccessSheild mode="table" size={3} level={1}>
        <Table
          loading={coins.isLoading}
          columns={columns}
          dataSource={sortedCoins}
          rowKey={r => JSON.stringify(r.symbol)}
          pagination={false}
        />
      </AccessSheild>
    </OverviewWidget>
  );
}
