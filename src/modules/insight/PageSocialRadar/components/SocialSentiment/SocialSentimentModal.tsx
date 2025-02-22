import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type EChartsOption } from 'echarts';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { type SocialRadarSentiment } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { formatNumber } from 'utils/numbers';
import { ReadableDate } from 'shared/ReadableDate';
import { ECharts } from 'shared/ECharts';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { Coin } from 'shared/Coin';
import { ReactComponent as Logo } from './logo.svg';
import { SocialSentimentTitle } from './SocialSentimentTitle';

interface ChartItem {
  price: number;
  relatedAt: string;
  dateType: 'first_mention' | 'last_mention' | 'irrelevant' | 'normal';
  priceType: 'normal' | 'biggest_pump' | 'biggest_dump';
  y: number;
  i: number;
}

export const useChartConfig = (
  signal?: SocialRadarSentiment | null,
  tick?: number,
) => {
  const { t } = useTranslation('coin-radar');
  const chartConfig = useMemo<EChartsOption | null>(() => {
    if (!signal?.signals_analysis || !tick) return null;
    const prices = signal.signals_analysis.sparkline?.prices ?? [];
    const dates = (signal.signals_analysis.sparkline?.related_ats ?? []).map(
      x => dayjs(x),
    );
    const firstMention = dayjs(signal.first_signal_related_at);
    const lastMention = dayjs(signal.last_signal_related_at);

    const parsedData: ChartItem[] = [];
    let biggestDump: ChartItem | null = null;
    let biggestPump: ChartItem | null = null;
    let firstMentionPicked = false;
    let lastMentionPicked = false;
    let j = 0;
    for (const [i, price] of prices.entries()) {
      const date = dates[i];
      if (!price || !date) continue;
      const chartItem: ChartItem = {
        dateType: date.isAfter(firstMention) ? 'normal' : 'irrelevant',
        price,
        priceType: 'normal',
        relatedAt: date.toISOString(),
        y: price * 1_000_000,
        i: j++,
      };

      const dateType: (typeof parsedData)[number]['dateType'] = date.isAfter(
        firstMention,
      )
        ? 'normal'
        : 'irrelevant';
      if (chartItem.dateType === 'normal' && !firstMentionPicked) {
        chartItem.dateType = firstMention.isSame(lastMention)
          ? 'last_mention'
          : 'first_mention';
        firstMentionPicked = true;
      } else if (
        lastMention.isAfter(firstMention) &&
        date.isAfter(lastMention) &&
        !lastMentionPicked
      ) {
        chartItem.dateType = 'last_mention';
        lastMentionPicked = true;
      }

      if (dateType !== 'irrelevant') {
        const firstMentionPrice = parsedData.find(
          x => x.dateType !== 'irrelevant',
        )?.price as number; // first message
        if (
          price < (biggestDump?.price ?? Number.POSITIVE_INFINITY) &&
          price <= firstMentionPrice
        ) {
          biggestDump = chartItem;
        }
        if (
          price > (biggestPump?.price ?? Number.NEGATIVE_INFINITY) &&
          price >= firstMentionPrice
        ) {
          biggestPump = chartItem;
        }
      }
      parsedData.push(chartItem);
    }
    if (biggestDump) {
      biggestDump.priceType = 'biggest_dump';
    }
    if (biggestPump) {
      biggestPump.priceType = 'biggest_pump';
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
          symbolSize: 7,
          label: {
            show: false,
          },
          itemStyle: {
            color: ({ dataIndex }) => {
              const x = parsedData[dataIndex];
              if (
                x.dateType === 'first_mention' ||
                x.dateType === 'last_mention' ||
                x.priceType !== 'normal'
              )
                return '#eee';
              return 'transparent';
            },
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
            data: parsedData.some(x => x.dateType !== 'irrelevant')
              ? [
                  {
                    yAxis: parsedData.find(x => x.dateType !== 'irrelevant')?.y,
                    xAxis: parsedData.find(x => x.dateType !== 'irrelevant')
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
  }, [signal, t, tick]);

  return chartConfig;
};

export const SocialSentimentModal: FC<{
  value?: SocialRadarSentiment | null;
}> = ({ value }) => {
  const { t } = useTranslation('coin-radar');
  const [tick, setTick] = useState(1); // used as dependency to update content
  const chartConfig = useChartConfig(value, tick);

  useEffect(() => setTick(p => p + 1), [value]);

  return (
    <>
      {value?.signals_analysis && chartConfig && (
        <div className="flex min-w-[360px] flex-col overflow-hidden mobile:min-w-full">
          <div className="mb-4 hidden items-center gap-2 text-base mobile:flex">
            <Logo />
            {t('social-radar.table.sentiment.title')}
          </div>
          <div className="mb-4 flex items-center justify-between gap-1">
            <SocialSentimentTitle value={value} className="text-lg" />
            <div className="flex items-center gap-1 text-xs">
              {value.gauge_tag === 'LONG'
                ? t('call-change.long')
                : value.gauge_tag === 'SHORT'
                ? t('call-change.short')
                : null}
            </div>
          </div>
          {value.symbol && (
            <div className="mb-2">
              <Coin
                coin={value.symbol}
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
                value={value.signals_analysis.current_price}
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
                  value.gauge_tag === 'LONG'
                    ? value.signals_analysis.max_profit_percentage
                    : value.signals_analysis.max_loss_percentage
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
                    value.gauge_tag === 'LONG'
                      ? value.signals_analysis.max_loss_percentage
                      : value.signals_analysis.max_profit_percentage,
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
                {t('call-change.last-mention')}
              </div>
              <ReadableDate
                popup={false}
                value={value.last_signal_related_at}
                className="text-sm capitalize"
              />
            </div>
            <div className="flex items-center justify-between gap-1 text-xs">
              <div className="text-v1-content-secondary">
                {t('call-change.analyzed-messages')}
              </div>
              <ReadableNumber
                popup="never"
                value={value.messages_count}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
