import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { useCoinDetails, usePoolDetails } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { HoverTooltip } from 'shared/HoverTooltip';

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
            'inline-flex items-center gap-1 text-xxs font-normal text-v1-content-secondary'
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
          'flex grow items-center justify-end gap-2 text-xs font-normal text-v1-content-primary',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function CoinStatsWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const coinOverview = useCoinDetails({ slug });
  const pool = usePoolDetails({ slug });
  const { t } = useTranslation('coin-radar');

  const marketCapPercentage =
    ((coinOverview.data?.data?.total_volume ?? 0) /
      (coinOverview.data?.data?.market_cap ?? 1)) *
    100;
  const circulationPercentage =
    (typeof coinOverview.data?.data?.max_supply !== 'number' &&
      typeof coinOverview.data?.data?.total_supply !== 'number') ||
    typeof coinOverview.data?.data?.circulating_supply !== 'number'
      ? null
      : ((coinOverview.data?.data?.circulating_supply ?? 0) /
          Math.max(
            coinOverview.data?.data?.max_supply ?? 0,
            coinOverview.data?.data?.total_supply ?? 0,
          )) *
        100;

  if (pool.data) return null;

  return (
    <div
      className={clsx('space-y-4 rounded-md bg-v1-surface-l2 p-3', className)}
    >
      <StatRow label={t('coin-details.tabs.coin_stats.volume')}>
        <DirectionalNumber
          value={coinOverview.data?.data?.volume_change_percentage_24h}
          suffix=" (24h)"
          showIcon
          showSign
          label="%"
          format={{
            decimalLength: 1,
          }}
        />
        <ReadableNumber
          value={coinOverview.data?.data?.total_volume}
          label="$"
        />
      </StatRow>
      <StatRow label={t('coin-details.tabs.coin_stats.market_cap')}>
        <DirectionalNumber
          value={coinOverview.data?.data?.market_cap_change_percentage_24h}
          suffix=" (24h)"
          showIcon
          showSign
          label="%"
          format={{
            decimalLength: 1,
          }}
        />
        <ReadableNumber value={coinOverview.data?.data?.market_cap} label="$" />
      </StatRow>
      <StatRow
        label={t('coin-details.tabs.coin_stats.volume_market_cap')}
        info={t('coin-details.tabs.coin_stats.volume_market_cap_info')}
      >
        <ReadableNumber
          value={marketCapPercentage}
          label="%"
          format={{
            decimalLength: 1,
          }}
        />
      </StatRow>
      <StatRow label={t('coin-details.tabs.coin_stats.fdv')}>
        <ReadableNumber
          value={coinOverview.data?.data?.fully_diluted_valuation}
          label="$"
        />
      </StatRow>
      <div className="space-y-2">
        <StatRow label={t('coin-details.tabs.coin_stats.circulating_supply')}>
          <ReadableNumber
            value={coinOverview.data?.data?.circulating_supply}
            label={coinOverview.data?.symbol.abbreviation}
          />
        </StatRow>
        <StatRow>
          {typeof circulationPercentage === 'number' && (
            <div className="relative h-1 w-full max-w-full grow overflow-hidden rounded bg-v1-background-disabled">
              <div
                className="absolute left-0 top-0 h-full rounded bg-v1-content-tertiary-inverse"
                style={{
                  width: `${circulationPercentage}%`,
                }}
              />
            </div>
          )}
          <ReadableNumber
            value={circulationPercentage}
            label="%"
            className="shrink-0"
            popup="never"
            format={{
              decimalLength: 1,
            }}
          />
        </StatRow>
      </div>
      <StatRow label={t('coin-details.tabs.coin_stats.total_supply')}>
        <ReadableNumber
          value={coinOverview.data?.data?.total_supply}
          label={coinOverview.data?.symbol.abbreviation}
        />
      </StatRow>
      <StatRow
        label={t('coin-details.tabs.coin_stats.fully_diluted_valuation')}
      >
        <ReadableNumber
          value={coinOverview.data?.data?.fully_diluted_valuation}
          label={coinOverview.data?.symbol.abbreviation}
        />
      </StatRow>
    </div>
  );
}
