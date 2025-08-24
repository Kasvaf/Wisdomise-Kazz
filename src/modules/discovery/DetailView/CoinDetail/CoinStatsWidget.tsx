import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type ComplexSlug, useUnifiedCoinDetails } from './lib';

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

export function CoinStatsWidget({
  className,
  slug,
}: {
  className?: string;
  slug: ComplexSlug;
}) {
  const { data } = useUnifiedCoinDetails({ slug });
  const { t } = useTranslation('coin-radar');

  const marketCapPercentage =
    ((data?.marketData.total_volume ?? 0) /
      (data?.marketData.market_cap ?? 1)) *
    100;
  const circulationPercentage =
    (typeof data?.marketData?.max_supply !== 'number' &&
      typeof data?.marketData?.total_supply !== 'number') ||
    typeof data?.marketData?.circulating_supply !== 'number'
      ? null
      : ((data?.marketData?.circulating_supply ?? 0) /
          Math.max(
            data?.marketData?.max_supply ?? 0,
            data?.marketData?.total_supply ?? 0,
          )) *
        100;

  if (data?.marketData) return null;

  return (
    <div
      className={clsx('space-y-4 rounded-md bg-v1-surface-l1 p-3', className)}
    >
      <StatRow label={t('coin-details.tabs.coin_stats.volume')}>
        <DirectionalNumber
          format={{
            decimalLength: 1,
          }}
          label="%"
          showIcon
          showSign
          suffix=" (24h)"
          value={data?.marketData.total_volume_change_percentage_24h}
        />
        <ReadableNumber label="$" value={data?.marketData.total_volume} />
      </StatRow>
      <StatRow label={t('coin-details.tabs.coin_stats.market_cap')}>
        <DirectionalNumber
          format={{
            decimalLength: 1,
          }}
          label="%"
          showIcon
          showSign
          suffix=" (24h)"
          value={data?.marketData.market_cap_change_percentage_24h}
        />
        <ReadableNumber label="$" value={data?.marketData.market_cap} />
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
      <StatRow label={t('coin-details.tabs.coin_stats.fdv')}>
        <ReadableNumber
          label="$"
          value={data?.marketData.fully_diluted_valuation}
        />
      </StatRow>
      <div className="space-y-2">
        <StatRow label={t('coin-details.tabs.coin_stats.circulating_supply')}>
          <ReadableNumber
            label={data?.symbol.abbreviation}
            value={data?.marketData.circulating_supply}
          />
        </StatRow>
        <StatRow>
          {typeof circulationPercentage === 'number' && (
            <div className="relative h-1 w-full max-w-full grow overflow-hidden rounded bg-v1-background-disabled">
              <div
                className="absolute top-0 left-0 h-full rounded bg-v1-content-tertiary-inverse"
                style={{
                  width: `${circulationPercentage}%`,
                }}
              />
            </div>
          )}
          <ReadableNumber
            className="shrink-0"
            format={{
              decimalLength: 1,
            }}
            label="%"
            popup="never"
            value={circulationPercentage}
          />
        </StatRow>
      </div>
      <StatRow label={t('coin-details.tabs.coin_stats.total_supply')}>
        <ReadableNumber
          label={data?.symbol.abbreviation}
          value={data?.marketData?.total_supply}
        />
      </StatRow>
    </div>
  );
}
