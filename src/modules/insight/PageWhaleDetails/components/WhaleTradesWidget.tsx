import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { type SingleWhale, useHasFlag, useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReadableDuration } from 'shared/ReadableDuration';
import Table from 'shared/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { AccessShield } from 'shared/AccessShield';
import BetaVersion from 'shared/BetaVersion';
import { DebugPin } from 'shared/DebugPin';

export function WhaleTradesWidget({
  className,
  holderAddress,
  networkName,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
}) {
  const { t } = useTranslation('whale');
  const hasFlag = useHasFlag();
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const columns = useMemo<Array<ColumnType<SingleWhale['assets'][number]>>>(
    () => [
      {
        title: t('whale_trades.name'),
        fixed: 'left',
        render: (_, row) => <Coin coin={row.symbol} imageClassName="size-6" />,
      },
      {
        title: t('whale_trades.number_of_transactions'),
        render: (_, row) => (
          <ReadableNumber value={row.total_recent_transfers} />
        ),
      },
      {
        title: (
          <span className="flex items-center gap-1">
            <DebugPin
              title="/coin-radar/whale-radar?trading_pnl"
              color="orange"
            />
            {t('whale_trades.trading_pnl')}
            <BetaVersion variant="beta" minimal />
          </span>
        ),
        colSpan: hasFlag('/coin-radar/whale-radar?trading_pnl') ? 1 : 0,
        render: (_, row) => (
          <DirectionalNumber
            value={row.recent_trading_pnl}
            label="$"
            showSign
            showIcon
          />
        ),
      },
      {
        title: (
          <span className="flex items-center gap-1">
            <DebugPin
              title="/coin-radar/whale-radar?trading_pnl"
              color="orange"
            />
            {t('whale_trades.returns')}
            <BetaVersion variant="beta" minimal />
          </span>
        ),
        colSpan: hasFlag('/coin-radar/whale-radar?trading_pnl') ? 1 : 0,
        render: (_, row) => (
          <DirectionalNumber
            value={row.recent_trading_pnl_percentage}
            label="%"
            showSign
            showIcon
          />
        ),
      },
      {
        title: t('whale_trades.volume_of_trades'),
        render: (_, row) => (
          <ReadableNumber
            value={row.total_recent_volume_transferred}
            label="$"
            popup="never"
          />
        ),
      },
      {
        title: t('whale_trades.price'),
        render: (_, row) => (
          <ReadableNumber value={row.market_data.current_price} label="$" />
        ),
      },
      {
        title: t('whale_trades.avg_duration'),
        render: (_, row) => (
          <ReadableDuration
            value={
              typeof row.recent_avg_trade_duration_seconds === 'number'
                ? row.recent_avg_trade_duration_seconds * 1000
                : null
            }
          />
        ),
      },
    ],
    [t, hasFlag],
  );

  return (
    <OverviewWidget
      className={className}
      title={t('whale_trades.title')}
      loading={whale.isLoading}
      empty={whale.data?.assets.filter(x => x.label !== 'holding').length === 0}
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'free': true,
          'pro': 3,
          'pro+': 3,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={
            whale.data?.assets.filter(x => x.label !== 'holding') ?? []
          }
          rowKey={row => JSON.stringify(row.symbol)}
          loading={whale.isLoading}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
