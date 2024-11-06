import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { Tooltip } from 'antd';
import { bxInfoCircle, bxRefresh } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useHasFlag, useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import BetaVersion from 'shared/BetaVersion';

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
  const hasFlag = useHasFlag();
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const winPercent =
    (whale.data?.recent_trading_wins ?? 0) /
    ((whale.data?.recent_trading_wins ?? 0) +
      (whale.data?.recent_trading_losses ?? 0));

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
            label="$"
            className="block text-4xl"
          />
          <button disabled={whale.isLoading} onClick={() => whale.refetch()}>
            <Icon
              name={bxRefresh}
              size={24}
              className={clsx(whale.isFetching && 'animate-spin')}
            />
          </button>
        </div>
        <div className="flex items-center justify-start gap-1">
          <DirectionalNumber
            value={whale.data?.last_30_days_balance_change}
            label="$"
            showSign={false}
            className="text-sm"
          />
          <DirectionalNumber
            className="text-sm"
            value={whale.data?.last_30_days_balance_change_percentage}
            label="%"
            prefix="("
            suffix=")"
            showSign
            showIcon={false}
          />
        </div>
      </div>
      <div className="h-px bg-v1-content-disabled" />
      {hasFlag('/coin-radar/whale-radar?trading_pnl') && (
        <StatRow label={t('whale_overview.trading_pnl')} beta>
          <DirectionalNumber
            value={whale.data?.recent_trading_pnl}
            label="$"
            showIcon={false}
          />
        </StatRow>
      )}
      <StatRow
        label={t('whale_overview.trading_volume')}
        info={t('top_whales.trading_volume.info')}
      >
        <ReadableNumber value={whale.data?.recent_trading_volume} label="$" />
      </StatRow>
      {hasFlag('/coin-radar/whale-radar?win_lose') && (
        <StatRow
          label={t('whale_overview.trading_win_rate')}
          className="w-full flex-wrap"
          beta
        >
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
        {whale.data?.trading_assets.length}
      </StatRow>
      <StatRow
        label={t('whale_overview.holding_tokens.title')}
        info={t('whale_overview.holding_tokens.info')}
      >
        {whale.data?.holding_assets.length}
      </StatRow>
    </OverviewWidget>
  );
}
