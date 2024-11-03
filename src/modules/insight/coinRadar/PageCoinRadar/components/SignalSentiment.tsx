import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxHappy, bxMeh, bxSad } from 'boxicons-quasar';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { type CoinSignal } from 'api';
import Icon from '../../../../shared/Icon';
import { ReadableDate } from '../../../../shared/ReadableDate';
import { DirectionalNumber } from '../../../../shared/DirectionalNumber';
import { ReadableNumber } from '../../../../shared/ReadableNumber';

export const SignalSentiment: FC<{
  signal: CoinSignal;
  className?: string;
}> = ({ signal, className }) => {
  const { t } = useTranslation('coin-radar');
  const [tick, setTick] = useState(1); // used as dependency to update content

  const tooltip = useMemo(() => {
    if (!signal.signals_analysis || !tick) return null;
    const date = dayjs(signal.signals_analysis.call_time);
    return (
      <>
        {signal.signals_analysis && date && (
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
                value={signal.signals_analysis.trigger_price}
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
                value={signal.signals_analysis.min_price}
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
                value={signal.signals_analysis.max_price}
                label="usdt"
                className="text-base"
              />
            </div>
            <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.pnl')}
              </div>
              <DirectionalNumber
                value={signal.signals_analysis.real_pnl_percentage}
                className="text-base"
                popup="never"
                suffix={` (${Math.abs(date.diff(undefined, 'hour'))}h)`}
              />
            </div>
          </div>
        )}
      </>
    );
  }, [signal, t, tick]);

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
          'space-y-1 whitespace-nowrap',
          tooltip ? 'cursor-help' : 'text-xs font-light opacity-70',
          className,
        )}
      >
        <div
          className={clsx(
            'flex items-center gap-1 text-sm',
            signal.gauge_tag === 'LONG'
              ? 'text-v1-content-positive'
              : signal.gauge_tag === 'SHORT'
              ? 'text-v1-content-negative'
              : 'text-v1-content-primary',
          )}
        >
          <Icon
            size={18}
            name={
              signal.gauge_tag === 'LONG'
                ? bxHappy
                : signal.gauge_tag === 'SHORT'
                ? bxSad
                : bxMeh
            }
          />
          {signal.gauge_tag === 'LONG'
            ? t('coin-details.tabs.social_sentiment.positive')
            : signal.gauge_tag === 'SHORT'
            ? t('coin-details.tabs.social_sentiment.negative')
            : signal.gauge_tag}
        </div>
        <div className="flex items-center gap-1 ps-[22px] text-xs">
          <label className="text-v1-content-secondary">
            {'Hunted At:' /* NAITODO */}
          </label>
          <ReadableDate
            popup={false}
            value={signal.signals_analysis.call_time}
          />
          <DirectionalNumber
            popup="never"
            value={signal.signals_analysis.real_pnl_percentage}
            label="%"
            prefix="("
            suffix=")"
            showIcon={false}
            showSign
          />
        </div>
      </span>
    </Tooltip>
  );
};
