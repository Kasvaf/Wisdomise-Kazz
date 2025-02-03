import { type EChartsOption } from 'echarts';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { type SocialRadarSentiment } from 'api';
import { formatNumber } from 'utils/numbers';

interface ChartItem {
  price: number;
  relatedAt: string;
  dateType: 'first_mention' | 'last_mention' | 'irrelevant' | 'normal';
  priceType: 'normal' | 'biggest_pump' | 'biggest_dump';
  y: number;
  i: number;
}

export const useChartConfig = (signal: SocialRadarSentiment, tick: number) => {
  const { t } = useTranslation('coin-radar');
  const chartConfig = useMemo<EChartsOption | null>(() => {
    if (!signal.signals_analysis || !tick) return null;
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
