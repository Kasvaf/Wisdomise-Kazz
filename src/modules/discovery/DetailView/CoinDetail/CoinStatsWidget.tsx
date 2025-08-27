import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useUnifiedCoinDetails } from './lib';

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
            'inline-flex items-center gap-1 font-normal text-v1-content-secondary text-xxs'
          }
        >
          {label}{' '}
          {info && (
            <HoverTooltip title={info}>
              <Icon name={bxInfoCircle} size={18} />
            </HoverTooltip>
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

export function CoinStatsWidget({ className }: { className?: string }) {
  const { marketData, symbol } = useUnifiedCoinDetails();
  const { t } = useTranslation('coin-radar');

  const marketCapPercentage =
    ((marketData.totalVolume ?? 0) / (marketData.marketCap ?? 1)) * 100;

  if (!marketData) return null;

  return (
    <div
      className={clsx('space-y-4 rounded-md bg-v1-surface-l1 p-3', className)}
    >
      <StatRow label={t('coin-details.tabs.coin_stats.volume')}>
        <ReadableNumber label="$" value={marketData.totalVolume} />
      </StatRow>
      <StatRow label={t('coin-details.tabs.coin_stats.market_cap')}>
        <ReadableNumber label="$" value={marketData.marketCap} />
      </StatRow>
      <StatRow
        info={t('coin-details.tabs.coin_stats.volume_market_cap_info')}
        label={t('coin-details.tabs.coin_stats.volume_market_cap')}
      >
        <ReadableNumber
          format={{
            decimalLength: 1,
          }}
          label="%"
          value={marketCapPercentage}
        />
      </StatRow>
      <StatRow label={t('coin-details.tabs.coin_stats.total_supply')}>
        <ReadableNumber
          label={symbol.abbreviation}
          value={marketData?.totalSupply}
        />
      </StatRow>
    </div>
  );
}
