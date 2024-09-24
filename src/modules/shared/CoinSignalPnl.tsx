import { clsx } from 'clsx';
import { Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { type CoinSignalAnalysis } from 'api';
import { ReadableNumber } from './ReadableNumber';
import PriceChange from './PriceChange';

export function CoinSignalPnl({
  className,
  signalAnalysis,
  emptyText,
}: {
  className?: string;
  signalAnalysis?: CoinSignalAnalysis | null;
  emptyText?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const [tick, setTick] = useState(1); // used as dependency to update content

  const label = useMemo(() => {
    return (
      <>
        {signalAnalysis ? (
          <PriceChange
            value={signalAnalysis.real_pnl_percentage}
            popup="never"
          />
        ) : (
          <>{emptyText ?? t('call-change.under-calculation')}</>
        )}
      </>
    );
  }, [signalAnalysis, emptyText, t]);

  const tooltip = useMemo(() => {
    if (!signalAnalysis || !tick) return null;
    const date = dayjs(signalAnalysis.call_time);
    return (
      <>
        {signalAnalysis && date && (
          <div className="space-y-1">
            <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.fire-time')}
              </div>
              <time className="block text-2xl font-medium">
                {date.format('D MMM H:mm')}
              </time>
            </div>
            <div className="h-px bg-v1-border-tertiary" />
            <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.trigger-price')}
              </div>
              <ReadableNumber
                popup="never"
                value={signalAnalysis.trigger_price}
                label="usdt"
                className="text-base"
              />
            </div>
            <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.min-price')}
              </div>
              <ReadableNumber
                popup="never"
                value={signalAnalysis.min_price}
                label="usdt"
                className="text-base"
              />
            </div>
            <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.max-price')}
              </div>
              <ReadableNumber
                popup="never"
                value={signalAnalysis.max_price}
                label="usdt"
                className="text-base"
              />
            </div>
            <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.pnl')}
              </div>
              <PriceChange
                value={signalAnalysis.real_pnl_percentage}
                popup="never"
                suffix={` (${Math.abs(date.diff(undefined, 'hour'))}h)`}
                textClassName="!text-base"
              />
            </div>
          </div>
        )}
      </>
    );
  }, [signalAnalysis, t, tick]);

  return (
    <Tooltip
      color="#151619"
      overlayInnerStyle={{
        padding: '1rem',
      }}
      title={tooltip}
      open={tooltip ? undefined : false}
      overlayClassName="pointer-events-none"
      onOpenChange={v => setTick(p => (v ? p + 1 : p))}
    >
      <span
        className={clsx(
          tooltip ? 'cursor-help' : 'font-light opacity-70',
          className,
        )}
      >
        {label}
      </span>
    </Tooltip>
  );
}
