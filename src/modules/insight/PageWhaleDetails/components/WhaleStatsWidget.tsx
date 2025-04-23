import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useHasFlag, useWhaleDetails } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import BetaVersion from 'shared/BetaVersion';
import { DebugPin } from 'shared/DebugPin';
import { ReadableDuration } from 'shared/ReadableDuration';

function StatRow({
  className,
  label,
  info,
  children,
  beta,
}: {
  className?: string;
  label?: ReactNode;
  info?: ReactNode;
  children?: ReactNode;
  beta?: boolean;
}) {
  return (
    <div className={clsx('flex items-center justify-between gap-4', className)}>
      {label && (
        <div
          className={
            'inline-flex items-center gap-1 text-xs font-normal text-v1-content-secondary'
          }
        >
          {label}
          {beta && <BetaVersion variant="beta" minimal />}
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

export function WhaleStatsWidget({
  className,
  holderAddress,
  networkName,
  hr,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
  hr?: boolean;
}) {
  const { t } = useTranslation('whale');
  const hasFlag = useHasFlag();
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const winPercent =
    (whale.data?.recent_trading_wins ?? 0) /
    ((whale.data?.recent_trading_wins ?? 0) +
      (whale.data?.recent_trading_losses ?? 0));

  if (whale.isLoading || !whale.data?.holder_address) return null;

  return (
    <>
      <div className={className}>
        <div className="space-y-6">
          <StatRow label={t('whale_overview.total_balance')}>
            <div className="flex flex-col items-end">
              <ReadableNumber
                value={whale.data?.last_30_balance_updates?.[0].balance_usdt}
                label="$"
                className="block text-2xl"
                popup="never"
              />
              <div className="flex items-center justify-start gap-2">
                <DirectionalNumber
                  value={whale.data?.last_30_days_balance_change}
                  label="$"
                  showSign={false}
                  className="text-xs"
                  popup="never"
                />
                <DirectionalNumber
                  className="text-xs"
                  value={whale.data?.last_30_days_balance_change_percentage}
                  label="%"
                  prefix="("
                  suffix=")"
                  showSign
                  showIcon={false}
                  popup="never"
                />
              </div>
            </div>
          </StatRow>

          {hasFlag('/coin-radar/whale-radar?trading_pnl') && (
            <>
              <StatRow label={t('whale_overview.trading_pnl')} beta>
                <DebugPin
                  title="/coin-radar/whale-radar?trading_pnl"
                  color="orange"
                />
                <DirectionalNumber
                  value={whale.data?.recent_trading_realized_pnl}
                  label="$"
                  showIcon={false}
                  popup="never"
                />
              </StatRow>
              <StatRow label={t('whale_overview.unrealized_trading_pnl')}>
                <DebugPin
                  title="/coin-radar/whale-radar?trading_pnl"
                  color="orange"
                />
                <DirectionalNumber
                  value={whale.data?.recent_trading_pnl}
                  label="$"
                  showIcon={false}
                  popup="never"
                />
              </StatRow>
            </>
          )}
          <StatRow
            label={t('whale_overview.trading_volume')}
            info={t('top_whales.trading_volume.info')}
          >
            <ReadableNumber
              value={whale.data?.recent_trading_volume}
              label="$"
              popup="never"
            />
          </StatRow>
          {hasFlag('/coin-radar/whale-radar?win_lose') && (
            <StatRow
              label={t('whale_overview.trading_win_rate')}
              className="w-full flex-wrap"
              beta
            >
              <DebugPin
                title="/coin-radar/whale-radar?win_lose"
                color="orange"
              />
              <div className="w-full basis-full space-y-2">
                <div className="relative h-1 w-full overflow-hidden rounded bg-v1-content-secondary">
                  {(whale.data?.recent_trading_losses ?? 0) > 0 && (
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
                    {whale.data?.recent_trading_wins ?? 0}{' '}
                    {t('whale_overview.wins')}
                  </span>
                  <span>
                    {whale.data?.recent_trading_losses ?? 0}{' '}
                    {t('whale_overview.losses')}
                  </span>
                </div>
              </div>
            </StatRow>
          )}
          <StatRow
            label={t('whale_overview.trading_tokens.title')}
            info={t('whale_overview.trading_tokens.info')}
          >
            {whale.data?.assets.filter(x => x.label !== 'holding').length}
          </StatRow>
          <StatRow
            label={t('whale_overview.holding_tokens.title')}
            info={t('whale_overview.holding_tokens.info')}
          >
            {whale.data?.assets.filter(x => x.label === 'holding').length}
          </StatRow>
          <StatRow label={t('14d_stats.avg_trade_duration')}>
            <ReadableDuration
              value={
                typeof whale.data?.recent_average_trade_duration_seconds ===
                'number'
                  ? whale.data?.recent_average_trade_duration_seconds * 1000
                  : null
              }
            />
          </StatRow>
          <StatRow label={t('14d_stats.transfer_volume')}>
            <ReadableNumber
              value={whale.data?.total_recent_transfer_volume}
              popup="never"
            />
          </StatRow>
          <StatRow label={t('14d_stats.avg_trade_day')}>
            <ReadableNumber
              value={
                typeof whale.data?.recent_number_of_trades === 'number'
                  ? whale.data?.recent_number_of_trades / 14
                  : null
              }
              popup="never"
            />
          </StatRow>
        </div>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
