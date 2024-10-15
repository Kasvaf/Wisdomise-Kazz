import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { Tooltip } from 'antd';
import { bxInfoCircle, bxRefresh } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import Icon from 'shared/Icon';

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

export function WhaleOverviewWidget({
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

  const winPercent =
    (whale.data?.last_30_days_trading_wins ?? 0) /
    ((whale.data?.last_30_days_trading_wins ?? 0) +
      (whale.data?.last_30_days_trading_losses ?? 0));

  return (
    <OverviewWidget
      className={className}
      loading={whale.isLoading}
      empty={!whale.data?.holder_address}
      contentClassName="space-y-6"
    >
      <div>
        <div className="flex justify-between gap-2">
          <ReadableNumber
            value={whale.data?.last_30_balance_updates[0].balance_usdt}
            label="usdt"
            className="block text-4xl"
          />
          <button disabled={whale.isLoading} onClick={() => whale.refetch()}>
            <Icon
              name={bxRefresh}
              size={24}
              className={clsx(whale.isLoading && 'animate-spin')}
            />
          </button>
        </div>
        <PriceChange
          className="!flex !justify-start"
          textClassName="!text-sm"
          value={whale.data?.last_30_days_balance_change_percentage}
          staticValue={whale.data?.last_30_days_balance_change}
        />
      </div>
      <div className="h-px bg-v1-content-disabled" />
      <StatRow label={t('whale_overview.trading_pnl')}>
        <ReadableNumber
          value={whale.data?.last_30_days_trading_pnl}
          label="usdt"
          className={clsx(
            (whale.data?.last_30_days_trading_pnl ?? 0) >= 0
              ? 'text-v1-content-positive'
              : 'text-v1-content-negative',
          )}
        />
      </StatRow>
      <StatRow label={t('whale_overview.trading_volume')}>
        <ReadableNumber
          value={whale.data?.last_30_days_transfer_volume}
          label="usdt"
        />
      </StatRow>
      <StatRow
        label={t('whale_overview.trading_win_rate')}
        className="w-full flex-wrap"
      >
        <div className="w-full basis-full space-y-2">
          <div className="relative h-1 w-full overflow-hidden rounded bg-v1-content-secondary">
            {(whale.data?.last_30_days_trading_losses ?? 0) > 0 && (
              <div className="absolute left-0 top-0 h-full w-full bg-v1-content-negative" />
            )}
            <div
              className="absolute left-0 top-0 h-full bg-v1-content-positive"
              style={{
                width: `${winPercent * 100}%`,
              }}
            />
          </div>
          <div className="flex w-full grow items-center justify-between gap-2">
            <span>
              {whale.data?.last_30_days_trading_wins ?? 0}{' '}
              {t('whale_overview.wins')}
            </span>
            <span>
              {whale.data?.last_30_days_trading_losses ?? 0}{' '}
              {t('whale_overview.losses')}
            </span>
          </div>
        </div>
      </StatRow>
      <StatRow label={t('whale_overview.trading_tokens')}>
        {whale.data?.trading_assets.length}
      </StatRow>
      <StatRow label={t('whale_overview.holding_tokens')}>
        {whale.data?.holding_assets.length}
      </StatRow>
    </OverviewWidget>
  );
}
