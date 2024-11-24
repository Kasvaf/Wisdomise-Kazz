import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxHappy, bxMeh, bxSad } from 'boxicons-quasar';
import dayjs from 'dayjs';
import { type TinyAreaConfig, TinyArea } from '@ant-design/plots';
import { type CoinSignal } from 'api';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { formatNumber } from 'utils/numbers';
import Icon from '../../../../../shared/Icon';
import { ReadableDate } from '../../../../../shared/ReadableDate';
import { DirectionalNumber } from '../../../../../shared/DirectionalNumber';
import { ReadableNumber } from '../../../../../shared/ReadableNumber';
import { ReactComponent as Logo } from './logo.svg';

export const SignalSentiment: FC<{
  signal: CoinSignal;
  className?: string;
  minimal?: boolean;
}> = ({ signal, className, minimal }) => {
  const { t } = useTranslation('coin-radar');
  const [tick, setTick] = useState(1); // used as dependency to update content

  const chartConfig = useMemo<TinyAreaConfig>(() => {
    let data = (signal.signals_analysis.sparkline?.prices ?? [])
      .map((price, index) => {
        if (!signal.signals_analysis.sparkline?.related_ats?.[index]) {
          return null;
        }
        const isCallTime = dayjs(
          signal.signals_analysis.sparkline?.related_ats?.[index],
        ).isSame(signal.signals_analysis.call_time);

        return {
          price,
          relatedAt: signal.signals_analysis.sparkline?.related_ats?.[index],
          type: isCallTime
            ? 'start'
            : price === signal.signals_analysis.max_price
            ? 'max'
            : price === signal.signals_analysis.min_price
            ? 'min'
            : null,
        };
      })
      .filter(x => x !== null);
    data = data.slice(
      data.findIndex(
        x =>
          Math.abs(
            dayjs(x.relatedAt).diff(
              signal.signals_analysis.call_time,
              'minutes',
            ),
          ) <= 120,
      ),
    );
    return {
      height: 90,
      autoFit: true,
      data: data.map(r => r.price),
      smooth: true,
      areaStyle: {
        fill: 'l(270) 0:#282A32 1:#00ffa27d',
      },
      line: {
        color: '#00FFA3',
      },
      padding: [6, 0, 0, 0],
      point: {
        size: 4,
        style: item => {
          if (!item?.x || !data[+item.x]) return {};
          const itemObj = data[+item.x];
          if (itemObj.type === 'start') {
            return {
              lineWidth: 2,
              fillOpacity: 1,
              fill: 'white',
              stroke: '#080809',
              strokeOpacity: 1,
            };
          }
          return {
            fillOpacity: 0,
            strokeOpacity: 0,
          };
        },
        shape: 'circle',
      },
      annotations: [
        {
          type: 'line',
          start: [
            'min',
            data.find(x => x.type === 'start')?.price?.toString() || 'max',
          ],
          end: [
            'max',
            data.find(x => x.type === 'start')?.price?.toString() || 'max',
          ],
          style: {
            stroke: 'white',
            strokeOpacity: 0.4,
            lineWidth: 1,
            lineDash: [2, 2],
          },
        },
      ],
      tooltip: {
        domStyles: {
          'g2-tooltip': {
            background: '#151619',
            color: '#fff',
            boxShadow: 'none',
            borderRadius: '0.25rem',
            letterSpacing: '0.5px',
          },
        },
        customContent: dt => {
          if (dt && data[+dt]) {
            return `$ ${formatNumber(data[+dt].price, {
              compactInteger: true,
              decimalLength: 3,
              minifyDecimalRepeats: true,
              seperateByComma: true,
            })}`;
          }
          return '';
        },
      },
    };
  }, [signal]);

  const tooltip = useMemo(() => {
    if (!signal.signals_analysis || !tick) return null;
    const date = dayjs(signal.signals_analysis.call_time);
    return (
      <>
        {signal.signals_analysis && date && (
          <div className="flex min-w-56 flex-col gap-3">
            <div className="hidden items-center gap-2 text-base mobile:flex">
              <Logo />
              {t('social-radar.table.sentiment.title')}
            </div>
            <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.fire-time')}
              </div>
              <time className="block text-2xl font-medium">
                {date.format('D MMM H:mm')}
              </time>
            </div>
            <div>
              <TinyArea {...chartConfig} />
            </div>
            <div className="h-px bg-v1-border-tertiary" />
            <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.trigger-price')}
              </div>
              <ReadableNumber
                popup="never"
                value={signal.signals_analysis.trigger_price}
                label="$"
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
                label="$"
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
                label="$"
                className="text-base"
              />
            </div>
            {/* <div>
              <div className="block text-xxs text-v1-content-secondary">
                {t('call-change.pnl')}
              </div>
              <DirectionalNumber
                value={signal.signals_analysis.real_pnl_percentage}
                className="text-base"
                label="%"
                popup="never"
                showIcon={false}
                showSign
                suffix={
                  <span className="ms-1">{`(${Math.abs(
                    date.diff(undefined, 'hour'),
                  )}h)`}</span>
                }
              />
            </div> */}
          </div>
        )}
      </>
    );
  }, [signal, t, chartConfig, tick]);
  return (
    <ClickableTooltip
      title={tooltip}
      disabled={!tooltip}
      onOpenChange={v => setTick(p => (v ? p + 1 : p))}
      chevron={false}
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
            'flex items-center gap-1 text-sm capitalize',
            minimal && 'flex-col !items-start',
            signal.gauge_tag === 'LONG'
              ? 'text-v1-content-positive'
              : signal.gauge_tag === 'SHORT'
              ? 'text-v1-content-negative'
              : 'text-v1-content-primary',
          )}
        >
          <div className="flex items-center gap-1">
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
              : signal.gauge_tag === 'NOT SURE'
              ? t('coin-details.tabs.social_sentiment.not_sure')
              : signal.gauge_tag}
            {minimal && (
              <span className="text-v1-content-primary">
                {t('coin-details.tabs.social_sentiment.market_side')}
              </span>
            )}
          </div>
          <span className="text-xxs font-normal text-v1-content-primary">
            {signal.gauge_tag === 'LONG'
              ? `(${t('coin-details.tabs.social_sentiment.long')})`
              : signal.gauge_tag === 'SHORT'
              ? `(${t('coin-details.tabs.social_sentiment.short')})`
              : null}
          </span>
        </div>
        {!minimal && (
          <div className="flex items-center gap-1 ps-[22px] text-xs">
            <label className="text-v1-content-secondary">
              {t('coin-details.tabs.social_sentiment.hunted-at')}:
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
        )}
      </span>
    </ClickableTooltip>
  );
};
