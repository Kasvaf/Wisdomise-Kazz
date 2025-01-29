import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxHappy, bxMeh, bxSad } from 'boxicons-quasar';
import dayjs from 'dayjs';
import { type EChartsOption } from 'echarts';
import { type SocialRadarSentiment } from 'api';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { ECharts } from 'shared/ECharts';
import { Coin } from 'shared/Coin';
import { formatNumber } from 'utils/numbers';
import { ReadableDuration } from 'shared/ReadableDuration';
import Icon from '../../../../../shared/Icon';
import { ReadableDate } from '../../../../../shared/ReadableDate';
import { DirectionalNumber } from '../../../../../shared/DirectionalNumber';
import { ReadableNumber } from '../../../../../shared/ReadableNumber';
import { ReactComponent as Logo } from './logo.svg';

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
  hidePnl?: boolean;
}> = ({ signal, className, minimal, hidePnl }) => {
  const { t } = useTranslation('coin-radar');
  const [tick, setTick] = useState(1); // used as dependency to update content

  const chartConfig = useMemo<EChartsOption | null>(() => {
    if (!signal.signals_analysis) return null;
    let parsedData: Array<{
      price: number;
      relatedAt: string;
      dateType: 'first_mention' | 'last_mention' | 'irrelevant' | 'normal';
      priceType: 'normal' | 'biggest_pump' | 'biggest_dump';
      y: number;
    }> = [];
    let biggestDumpPrice = Number.POSITIVE_INFINITY;
    let biggestPumpPrice = Number.NEGATIVE_INFINITY;
    let firstMentionPicked = false;
    let lastMentionPicked = false;
    for (
      let i = 0;
      i < (signal.signals_analysis.sparkline?.prices ?? []).length;
      i++
    ) {
      const price = (signal.signals_analysis.sparkline?.prices ?? [])[i];
      const relatedAtRaw = (signal.signals_analysis.sparkline?.related_ats ??
        [])[i];
      if (typeof price !== 'number' || typeof relatedAtRaw !== 'string')
        continue;
      const relatedAt = dayjs(relatedAtRaw).toISOString();
      const hasOneMsg = dayjs(signal.last_signal_related_at).isSame(
        signal.first_signal_related_at,
      );
      let dateType: (typeof parsedData)[number]['dateType'] = dayjs(
        relatedAt,
      ).isBefore(signal.first_signal_related_at)
        ? 'irrelevant'
        : 'normal';

      if (dateType === 'normal' && !firstMentionPicked) {
        firstMentionPicked = true;
        dateType = hasOneMsg ? 'last_mention' : 'first_mention';
        if (hasOneMsg) {
          lastMentionPicked = true;
        }
      }
      if (
        firstMentionPicked &&
        !lastMentionPicked &&
        dateType === 'normal' &&
        dayjs(relatedAt).isAfter(signal.last_signal_related_at)
      ) {
        lastMentionPicked = true;
        dateType = 'last_mention';
      }

      if (
        i === (signal.signals_analysis.sparkline?.prices ?? []).length - 1 &&
        (!firstMentionPicked || !lastMentionPicked)
      ) {
        dateType = 'last_mention';
      }

      if (
        dateType === 'normal' ||
        dateType === 'first_mention' ||
        dateType === 'last_mention'
      ) {
        biggestPumpPrice = price > biggestPumpPrice ? price : biggestPumpPrice;
        biggestDumpPrice = price < biggestDumpPrice ? price : biggestDumpPrice;
      }
      parsedData = [
        ...parsedData,
        {
          price,
          relatedAt,
          dateType,
          priceType: 'normal',
          y: price * 1_000_000,
        },
      ];
    }

    const callTimePrice = parsedData.find(x => x.dateType !== 'irrelevant')
      ?.price;
    const biggestDumpIndex = parsedData.findIndex(
      x =>
        typeof callTimePrice === 'number' &&
        x.price < callTimePrice &&
        x.dateType !== 'irrelevant' &&
        x.price === biggestDumpPrice,
    );
    const biggestPumpIndex = parsedData.findIndex(
      x =>
        typeof callTimePrice === 'number' &&
        x.price > callTimePrice &&
        x.dateType !== 'irrelevant' &&
        x.price === biggestPumpPrice,
    );
    if (biggestDumpIndex > -1) {
      parsedData[biggestDumpIndex].priceType = 'biggest_dump';
    }
    if (biggestPumpIndex > -1) {
      parsedData[biggestPumpIndex].priceType = 'biggest_pump';
    }

    return {
      grid: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: parsedData.map(x => x.relatedAt),
        boundaryGap: false,
        show: false,
      },
      yAxis: {
        type: 'value',
        min: () => 'dataMin',
        max: () => 'dataMax',
        show: true,
      },
      series: [
        {
          type: 'line',
          data: parsedData.map(x => x.y),
          smooth: true,
          lineStyle: {
            color: '#00FFA3',
            width: 2,
          },
          symbolSize: 10,
          label: {
            show: false,
          },
          itemStyle: {
            color: ({ dataIndex }) => {
              const x = parsedData[dataIndex];
              if (
                x.dateType === 'first_mention' ||
                x.dateType === 'last_mention'
              )
                return '#fff';
              if (x.priceType === 'biggest_dump') return '#ea3f55';
              if (x.priceType === 'biggest_pump') return '#00ffa3';
              return 'transparent';
            },
            borderWidth: 4,
          },
          markLine: {
            symbol: 'none',
            silent: true,
            lineStyle: {
              color: '#fff',
              width: 0.9,
              type: 'dashed',
              opacity: 0.6,
            },
            label: {
              show: false,
            },
            data: parsedData.some(x => x.dateType === 'first_mention')
              ? [
                  {
                    yAxis: parsedData.find(x => x.dateType === 'first_mention')
                      ?.y,
                    xAxis: parsedData.find(x => x.dateType === 'first_mention')
                      ?.relatedAt,
                  },
                ]
              : [],
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#151619',
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        padding: 4,
        borderColor: 'transparent',
        formatter: p => {
          // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
          /* @ts-ignore */
          const dataIndex = p?.[0]?.dataIndex;
          if (typeof dataIndex !== 'number') return '';
          const x = parsedData[dataIndex];
          const price = `$ ${formatNumber(x.price, {
            compactInteger: true,
            decimalLength: 3,
            minifyDecimalRepeats: true,
            seperateByComma: true,
          })}`;
          return [
            x.dateType === 'first_mention'
              ? t('call-change.first-mention')
              : '',
            x.dateType === 'last_mention' ? t('call-change.last-mention') : '',
            x.priceType === 'biggest_dump' ? t('call-change.biggest-dump') : '',
            x.priceType === 'biggest_pump' ? t('call-change.biggest-pump') : '',
            price,
          ]
            .filter(r => !!r)
            .join('<br>');
        },
      },
      backgroundColor: 'transparent',
    };
  }, [
    signal.first_signal_related_at,
    signal.last_signal_related_at,
    signal.signals_analysis,
    t,
  ]);

  const tooltip = useMemo(() => {
    if (!signal.signals_analysis || !tick || !chartConfig) return null;
    const date = dayjs(signal.signals_analysis.call_time);
    return (
      <>
        {signal.signals_analysis && chartConfig && date && (
          <div className="flex min-w-[360px] flex-col">
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
              {!hidePnl && (
                <div className="flex items-center justify-between gap-1 text-xs">
                  <div className="text-v1-content-secondary">
                    {t('call-change.last-pnl-update')}
                  </div>
                  <DirectionalNumber
                    popup="never"
                    value={signal.signals_analysis.real_pnl_percentage}
                    label="%"
                    showIcon={false}
                    suffix={
                      <div className="ps-1">
                        (
                        <ReadableDuration
                          value={dayjs(signal.signals_analysis.updated_at).diff(
                            Date.now(),
                          )}
                        />
                        )
                      </div>
                    }
                    showSign
                    className="text-sm"
                  />
                </div>
              )}
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
  }, [signal, tick, chartConfig, t, hidePnl]);

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
            {!hidePnl && (
              <DirectionalNumber
                popup="never"
                value={signal.signals_analysis.real_pnl_percentage}
                label="%"
                prefix="("
                suffix=")"
                showIcon={false}
                showSign
              />
            )}
          </div>
        )}
      </span>
    </ClickableTooltip>
  );
};
