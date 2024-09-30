import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { ReadableDuration } from 'shared/ReadableDuration';

function StatRow({
  className,
  label,
  info,
  children,
}: {
  className?: string;
  label?: ReactNode;
  info?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={clsx('flex items-center justify-between gap-4', className)}>
      {label && (
        <div
          className={
            'inline-flex items-center gap-1 text-xs font-normal text-v1-content-secondary'
          }
        >
          {label}{' '}
          {info && (
            <Tooltip title={info}>
              <Icon name={bxInfoCircle} size={18} />
            </Tooltip>
          )}
        </div>
      )}
      <div
        className={clsx(
          'flex grow items-center justify-end gap-2 text-xs font-normal text-v1-content-primary',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Whale14DaysStats({
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

  return (
    <OverviewWidget
      className={className}
      loading={whale.isLoading}
      empty={!whale.data?.holder_address}
      contentClassName="space-y-6"
      title={t('14d_stats.title')}
    >
      <StatRow label={t('14d_stats.avg_trade_duration')}>
        <ReadableDuration
          value={
            typeof whale.data?.last_14_days_total_trade_duration_seconds ===
              'number' &&
            typeof whale.data?.last_14_days_number_of_trades === 'number'
              ? (whale.data?.last_14_days_total_trade_duration_seconds * 1000) /
                (whale.data?.last_14_days_number_of_trades || 1)
              : null
          }
        />
      </StatRow>
      <StatRow label={t('14d_stats.avg_trade_day')}>
        <ReadableNumber
          value={
            typeof whale.data?.last_14_days_number_of_trades === 'number'
              ? whale.data?.last_14_days_number_of_trades / 14
              : null
          }
          popup="never"
        />
      </StatRow>
      <StatRow label={t('14d_stats.largest_losses')}>
        <ReadableNumber
          value={whale.data?.last_14_days_largest_loss}
          className="text-v1-content-negative"
        />
      </StatRow>
      <StatRow label={t('14d_stats.largest_gain')}>
        <ReadableNumber
          value={whale.data?.last_14_days_largest_win}
          className="text-v1-content-positive"
        />
      </StatRow>
      <StatRow label={t('14d_stats.transfer_volume')}>
        <ReadableNumber value={whale.data?.last_14_days_transfer_volume} />
      </StatRow>
    </OverviewWidget>
  );
}
