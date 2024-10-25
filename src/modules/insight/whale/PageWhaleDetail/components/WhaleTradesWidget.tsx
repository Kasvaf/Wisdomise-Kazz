import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { type SingleWhale, useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReadableDuration } from 'shared/ReadableDuration';
import Table from 'shared/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ProLocker } from 'shared/ProLocker';

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
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const columns = useMemo<
    Array<ColumnType<SingleWhale['trading_assets'][number]>>
  >(
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
        title: t('whale_trades.trading_pnl'),
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
        title: t('whale_trades.returns'),
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
          <ReadableDuration value={row.recent_avg_trade_duration_seconds} />
        ),
      },
    ],
    [t],
  );

  return (
    <OverviewWidget
      className={className}
      title={t('whale_trades.title')}
      loading={whale.isLoading}
      empty={whale.data?.trading_assets?.length === 0}
    >
      <ProLocker level={3} mode="table">
        <Table
          columns={columns}
          dataSource={whale.data?.trading_assets ?? []}
          rowKey={row => JSON.stringify(row.symbol)}
          loading={whale.isLoading}
        />
      </ProLocker>
    </OverviewWidget>
  );
}
