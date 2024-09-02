import { clsx } from 'clsx';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoinOverview } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';

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

export function CoinPricePerformance({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const coinOverview = useCoinOverview({ slug });
  const { t } = useTranslation('coin-radar');

  const priceGaugePercentage = useMemo(() => {
    if (
      typeof coinOverview.data?.data?.high_24h !== 'number' ||
      typeof coinOverview.data?.data?.low_24h !== 'number' ||
      typeof coinOverview.data?.data?.current_price !== 'number'
    )
      return null;
    const passed =
      coinOverview.data.data.current_price - coinOverview.data.data.low_24h;
    const total =
      coinOverview.data.data.high_24h - coinOverview.data.data.low_24h;
    return (passed / total) * 100;
  }, [coinOverview.data]);

  return (
    <div
      className={clsx(
        !coinOverview.data && 'animate-pulse blur-sm',
        'flex flex-col gap-8 overflow-visible text-xs',
        className,
      )}
    >
      <div>
        <p className=" text-v1-content-primary">
          {t('coin-details.tabs.price_performance.title')}
        </p>
        <div className="mt-3 flex items-center justify-between gap-4 text-xs">
          <div>
            <p className="mb-1 text-v1-content-secondary">
              {t('coin-details.tabs.price_performance.low_24h')}
            </p>
            <ReadableNumber
              value={coinOverview.data?.data?.low_24h}
              label="$"
            />
          </div>
          <div>
            <p className="mb-1 text-v1-content-secondary">
              {t('coin-details.tabs.price_performance.high_24h')}
            </p>
            <ReadableNumber
              value={coinOverview.data?.data?.high_24h}
              label="$"
            />
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
    </div>
  );
}
