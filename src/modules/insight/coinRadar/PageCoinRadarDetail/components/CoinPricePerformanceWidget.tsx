import { clsx } from 'clsx';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
import { useCoinOverview } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { OverviewWidget } from 'shared/OverviewWidget';

function StatRow({
  className,
  label,
  children,
}: {
  className?: string;
  label?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={clsx('flex items-center justify-between gap-4', className)}>
      {label && (
        <div className={'text-xs font-normal text-v1-content-secondary'}>
          {label}
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

export function CoinPricePerformanceWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const coinOverview = useCoinOverview({ slug });
  const [timeFrame, setTimeFrame] = useState<
    '1_d' | '7_d' | '14_d' | '21_d' | '30_d'
  >('1_d');

  const [low, high] = [
    coinOverview.data?.data?.[`min_price_${timeFrame}`],
    coinOverview.data?.data?.[`max_price_${timeFrame}`],
  ];

  const { t } = useTranslation('coin-radar');

  const priceGaugePercentage = useMemo(() => {
    if (
      typeof low !== 'number' ||
      typeof high !== 'number' ||
      typeof coinOverview.data?.data?.current_price !== 'number'
    )
      return null;
    const passed = high - low;
    const total = high - low;
    return (passed / total) * 100;
  }, [low, high, coinOverview]);

  return (
    <OverviewWidget
      className={clsx(!coinOverview.data && 'animate-pulse', className)}
      contentClassName="flex flex-col gap-8 overflow-visible text-xs"
    >
      <div>
        <div className="flex items-center justify-between text-v1-content-primary">
          <span>{t('coin-details.tabs.price_performance.title')}</span>
          <Select
            size="small"
            value={timeFrame}
            onChange={setTimeFrame}
            options={[
              {
                label: '24h',
                value: '1_d',
              },
              {
                label: '7d',
                value: '7_d',
              },
              {
                label: '14d',
                value: '14_d',
              },
              {
                label: '21d',
                value: '21_d',
              },
              {
                label: '30d',
                value: '30_d',
              },
            ]}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 text-xs">
          <div>
            <p className="mb-1 text-v1-content-secondary">
              {t('coin-details.tabs.price_performance.low')}
            </p>
            <ReadableNumber value={low} label="$" />
          </div>
          <div>
            <p className="mb-1 text-v1-content-secondary">
              {t('coin-details.tabs.price_performance.high')}
            </p>
            <ReadableNumber value={high} label="$" />
          </div>
        </div>
        {typeof priceGaugePercentage === 'number' && (
          <div className="relative mt-4 h-1 w-full max-w-full grow overflow-hidden rounded bg-v1-background-disabled">
            <div
              className="absolute left-0 top-0 h-full rounded bg-v1-content-tertiary-inverse"
              style={{
                width: `${priceGaugePercentage}%`,
              }}
            />
          </div>
        )}
      </div>
      <StatRow label={t('coin-details.tabs.price_performance.ath')}>
        <ReadableNumber value={coinOverview.data?.data?.ath} label="$" />
      </StatRow>
      <StatRow label={t('coin-details.tabs.price_performance.atl')}>
        <ReadableNumber value={coinOverview.data?.data?.atl} label="$" />
      </StatRow>
    </OverviewWidget>
  );
}
