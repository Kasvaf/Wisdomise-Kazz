import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { HoverTooltip } from 'shared/HoverTooltip';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

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
            'text-v1-content-secondary text-xxs inline-flex items-center gap-1 font-normal'
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
          'text-v1-content-primary flex grow items-center justify-end gap-2 text-xs font-normal',
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
      className={clsx('bg-v1-surface-l1 space-y-4 rounded-md p-3', className)}
    >
      <StatRow label={t('coin-details.tabs.coin_stats.volume')}>
        <DirectionalNumber
          value={data?.marketData.total_volume_change_percentage_24h}
          suffix=" (24h)"
          showIcon
          showSign
          label="%"
          format={{
            decimalLength: 1,
          }}
        />
        <ReadableNumber value={data?.marketData.total_volume} label="$" />
      </StatRow>
      <StatRow label={t('coin-details.tabs.coin_stats.market_cap')}>
        <DirectionalNumber
          value={data?.marketData.market_cap_change_percentage_24h}
          suffix=" (24h)"
          showIcon
          showSign
          label="%"
          format={{
            decimalLength: 1,
          }}
        />
        <ReadableNumber value={data?.marketData.market_cap} label="$" />
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
          value={data?.marketData.fully_diluted_valuation}
          label="$"
        />
      </StatRow>
      <div className="space-y-2">
        <StatRow label={t('coin-details.tabs.coin_stats.circulating_supply')}>
          <ReadableNumber
            value={data?.marketData.circulating_supply}
            label={data?.symbol.abbreviation}
          />
        </StatRow>
        <StatRow>
          {typeof circulationPercentage === 'number' && (
            <div className="bg-v1-background-disabled relative h-1 w-full max-w-full grow overflow-hidden rounded">
              <div
                className="bg-v1-content-tertiary-inverse absolute left-0 top-0 h-full rounded"
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
          value={data?.marketData?.total_supply}
          label={data?.symbol.abbreviation}
        />
      </StatRow>
    </div>
  );
}
