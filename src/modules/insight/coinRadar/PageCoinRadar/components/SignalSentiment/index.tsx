import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxHappy, bxMeh, bxSad } from 'boxicons-quasar';
import dayjs from 'dayjs';
import { type SocialRadarSentiment } from 'api';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { ECharts } from 'shared/ECharts';
import { Coin } from 'shared/Coin';
import Icon from '../../../../../shared/Icon';
import { ReadableDate } from '../../../../../shared/ReadableDate';
import { DirectionalNumber } from '../../../../../shared/DirectionalNumber';
import { ReadableNumber } from '../../../../../shared/ReadableNumber';
import { ReactComponent as Logo } from './logo.svg';
import { useChartConfig } from './useChartConfig';

const SignalSentimentTitle: FC<{
  signal: SocialRadarSentiment;
  className?: string;
}> = ({ signal, className }) => {
  const { t } = useTranslation('coin-radar');
  return (
    <div
      className={clsx(
        'flex items-center gap-1',
        signal.gauge_tag === 'LONG'
          ? 'text-v1-content-positive'
          : signal.gauge_tag === 'SHORT'
          ? 'text-v1-content-negative'
          : 'text-v1-content-primary',
        className,
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
        ? t('call-change.positive')
        : signal.gauge_tag === 'SHORT'
        ? t('call-change.negative')
        : signal.gauge_tag === 'NOT SURE'
        ? t('call-change.not_sure')
        : signal.gauge_tag}
    </div>
  );
};

const SignalSentimentDetails: FC<{
  signal: SocialRadarSentiment;
  className?: string;
}> = ({ signal, className }) => {
  const { t } = useTranslation('coin-radar');
  return (
    <div className={clsx('flex items-center gap-1', className)}>
      {signal.gauge_tag === 'LONG'
        ? t('call-change.long')
        : signal.gauge_tag === 'SHORT'
        ? t('call-change.short')
        : null}
    </div>
  );
};

export const SignalSentiment: FC<{
  signal: SocialRadarSentiment;
  className?: string;
  minimal?: boolean;
}> = ({ signal, className, minimal }) => {
  const { t } = useTranslation('coin-radar');
  const [tick, setTick] = useState(1); // used as dependency to update content

  const chartConfig = useChartConfig(signal, tick);

  const tooltip = useMemo(() => {
    if (!signal.signals_analysis || !tick || !chartConfig) return null;
    const date = dayjs(signal.signals_analysis.call_time);
    return (
      <>
        {signal.signals_analysis && chartConfig && date && (
          <div className="flex min-w-[360px] flex-col overflow-hidden mobile:min-w-full">
            <div className="mb-4 hidden items-center gap-2 text-base mobile:flex">
              <Logo />
              {t('social-radar.table.sentiment.title')}
            </div>
            <div className="mb-4 flex flex-col gap-1">
              <SignalSentimentTitle signal={signal} className="text-lg" />
              <div className="flex items-center gap-1 text-xs text-v1-content-secondary">
                <SignalSentimentDetails signal={signal} /> |
                <ReadableDate
                  popup={false}
                  value={signal.last_signal_related_at}
                />
              </div>
            </div>
            {signal.symbol && (
              <div className="mb-2">
                <Coin
                  coin={signal.symbol}
                  imageClassName="size-10"
                  nonLink
                  truncate={350}
                />
              </div>
            )}
            <div className="mb-4">
              <ECharts
                initOptions={{
                  height: 90,
                }}
                options={chartConfig}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1 text-xs">
                <div className="text-v1-content-secondary">
                  {t('call-change.current-price')}
                </div>
                <ReadableNumber
                  popup="never"
                  value={signal.signals_analysis.current_price}
                  label="$"
                  className="text-sm"
                />
              </div>
              <div className="flex items-center justify-between gap-1 text-xs">
                <div className="text-v1-content-secondary">
                  {t('call-change.biggest-pump')}
                </div>
                <DirectionalNumber
                  popup="never"
                  value={
                    signal.gauge_tag === 'LONG'
                      ? signal.signals_analysis.max_profit_percentage
                      : signal.signals_analysis.max_loss_percentage
                  }
                  label="%"
                  showIcon={false}
                  showSign
                  className="text-sm"
                />
              </div>
              <div className="flex items-center justify-between gap-1 text-xs">
                <div className="text-v1-content-secondary">
                  {t('call-change.biggest-dump')}
                </div>
                <DirectionalNumber
                  popup="never"
                  value={
                    -1 *
                    Math.abs(
                      signal.gauge_tag === 'LONG'
                        ? signal.signals_analysis.max_loss_percentage
                        : signal.signals_analysis.max_profit_percentage,
                    )
                  }
                  label="%"
                  showIcon={false}
                  showSign
                  className="text-sm"
                />
              </div>
              <div className="flex items-center justify-between gap-1 text-xs">
                <div className="text-v1-content-secondary">
                  {t('call-change.analyzed-messages')}
                </div>
                <ReadableNumber
                  popup="never"
                  value={signal.messages_count}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }, [signal, tick, chartConfig, t]);

  return (
    <ClickableTooltip
      title={tooltip}
      disabled={!tooltip}
      onOpenChange={v => setTick(p => (v ? p + 1 : p))}
      chevron={false}
    >
      <span className={clsx('space-y-1 whitespace-nowrap', className)}>
        <div
          className={clsx(
            'flex items-center gap-1 text-sm capitalize',
            minimal && 'flex-col !items-start',
          )}
        >
          <SignalSentimentTitle signal={signal} />
          <SignalSentimentDetails
            signal={signal}
            className="text-xxs font-normal"
          />
        </div>
        {!minimal && signal.signals_analysis && (
          <div className="flex items-center gap-1 ps-[22px] text-xs">
            <label className="text-v1-content-secondary">
              {t('call-change.last-mention')}:
            </label>
            <ReadableDate popup={false} value={signal.last_signal_related_at} />
          </div>
        )}
      </span>
    </ClickableTooltip>
  );
};
