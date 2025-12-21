import { Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'services/rest';
import { useWhaleDetails } from 'services/rest/discovery';
import BetaVersion from 'shared/BetaVersion';
import { DebugPin } from 'shared/DebugPin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { ReadableDuration } from 'shared/ReadableDuration';
import { ReadableNumber } from 'shared/ReadableNumber';

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
            'inline-flex items-center gap-1 font-normal text-v1-content-secondary text-xs'
          }
        >
          {label}
          {beta && <BetaVersion minimal variant="beta" />}
          {info && (
            <Tooltip title={info}>
              <Icon name={bxInfoCircle} size={18} />
            </Tooltip>
          )}
        </div>
      )}
      <div
        className={clsx(
          'flex grow items-center justify-end gap-2 font-normal text-v1-content-primary text-xs',
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
                className="block text-2xl"
                label="$"
                popup="never"
                value={whale.data?.last_30_balance_updates?.[0].balance_usdt}
              />
              <div className="flex items-center justify-start gap-2">
                <DirectionalNumber
                  className="text-xs"
                  label="$"
                  popup="never"
                  showSign={false}
                  value={whale.data?.last_30_days_balance_change}
                />
                <DirectionalNumber
                  className="text-xs"
                  label="%"
                  popup="never"
                  prefix="("
                  showIcon={false}
                  showSign
                  suffix=")"
                  value={whale.data?.last_30_days_balance_change_percentage}
                />
              </div>
            </div>
          </StatRow>

          {hasFlag('/discovery?whale_trading_pnl') && (
            <>
              <StatRow label={t('whale_overview.trading_pnl')}>
                <DebugPin color="orange" title="/discovery?whale_trading_pnl" />
                <DirectionalNumber
                  label="$"
                  popup="never"
                  showIcon={false}
                  value={whale.data?.recent_trading_realized_pnl}
                />
              </StatRow>
              <StatRow label={t('whale_overview.unrealized_trading_pnl')}>
                <DebugPin color="orange" title="/discovery?whale_trading_pnl" />
                <DirectionalNumber
                  label="$"
                  popup="never"
                  showIcon={false}
                  value={whale.data?.recent_trading_pnl}
                />
              </StatRow>
            </>
          )}
          <StatRow
            info={t('top_whales.trading_volume.info')}
            label={t('whale_overview.trading_volume')}
          >
            <ReadableNumber
              label="$"
              popup="never"
              value={whale.data?.recent_trading_volume}
            />
          </StatRow>
          {hasFlag('/discovery?whale_win_lose') && (
            <StatRow
              className="w-full flex-wrap"
              label={t('whale_overview.trading_win_rate')}
            >
              <DebugPin color="orange" title="/discovery?whale_win_lose" />
              <div className="w-full basis-full space-y-2">
                <div className="relative h-1 w-full overflow-hidden rounded bg-v1-content-secondary">
                  {(whale.data?.recent_trading_losses ?? 0) > 0 && (
                    <div className="absolute top-0 left-0 h-full w-full bg-v1-content-negative" />
                  )}
                  <div
                    className="absolute top-0 left-0 h-full bg-v1-content-positive"
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
            info={t('whale_overview.trading_tokens.info')}
            label={t('whale_overview.trading_tokens.title')}
          >
            {whale.data?.assets.filter(x => x.label !== 'holding').length}
          </StatRow>
          <StatRow
            info={t('whale_overview.holding_tokens.info')}
            label={t('whale_overview.holding_tokens.title')}
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
              popup="never"
              value={whale.data?.total_recent_transfer_volume}
            />
          </StatRow>
          <StatRow label={t('14d_stats.avg_trade_day')}>
            <ReadableNumber
              popup="never"
              value={
                typeof whale.data?.recent_number_of_trades === 'number'
                  ? whale.data?.recent_number_of_trades / 14
                  : null
              }
            />
          </StatRow>
        </div>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
