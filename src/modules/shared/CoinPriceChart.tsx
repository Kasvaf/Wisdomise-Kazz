import { type ComponentProps, type FC } from 'react';
import { type EChartsOption } from 'echarts';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { formatNumber } from 'utils/numbers';
import { ECharts } from 'shared/ECharts';
import { type WhaleRadarCoin, type CoinSignalAnalysis } from 'api';

interface PriceRow {
  value: number;
  related_at: string;
}

type ExtendedPriceRow = PriceRow & {
  y: number;
  x: number;
};

export const CoinPriceChart: FC<
  Omit<ComponentProps<typeof ECharts>, 'options'> & {
    value: PriceRow[];
    socialIndexes?:
      | null
      | NonNullable<CoinSignalAnalysis['sparkline']>['indexes'];
    whalesActivity?: null | NonNullable<WhaleRadarCoin['chart_data']>;
  }
> = ({ value, socialIndexes, whalesActivity, ...props }) => {
  const chartConfig = useMemo<EChartsOption>(() => {
    const extendedValue: ExtendedPriceRow[] = (value ?? []).map((row, x) => ({
      ...row,
      x,
      y: row.value * 1_000_000,
    }));

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
        data: extendedValue.map(x => x.related_at),
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
          data: extendedValue.map(({ y }) => y),
          smooth: true,
          lineStyle: {
            color: '#00FFA3',
            width: 2,
          },
          symbolSize: 6,
          showAllSymbol: true,
          label: {
            show: false,
          },
          itemStyle: {
            color: ({ dataIndex }) => {
              const row =
                typeof dataIndex === 'number' && extendedValue[dataIndex]
                  ? extendedValue[dataIndex]
                  : null;
              if (!row) return 'transparent';
              if (Object.values(socialIndexes ?? {}).includes(dataIndex)) {
                return '#eee';
              }
              const [buys, sells] = [
                whalesActivity?.[dataIndex].buys_number ?? 0,
                whalesActivity?.[dataIndex].sells_number ?? 0,
              ];
              if (buys || sells) {
                return '#eee';
                // return buys > sells
                //   ? '#00FFA3'
                //   : sells > buys
                //   ? '#F14056'
                //   : '#eee';
              }
              return 'transparent';
            },
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#1a956896' },
                { offset: 1, color: 'transparent' },
              ],
            },
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
          const row = extendedValue[dataIndex];
          if (!row) return '';
          let lines = [
            `Date: ${dayjs(row.related_at).format(
              'MMM D' + (whalesActivity ? '' : ', h:m'),
            )}`,
            `Price: $ ${formatNumber(row.value, {
              compactInteger: true,
              decimalLength: 3,
              minifyDecimalRepeats: true,
              seperateByComma: true,
            })}`,
          ];
          if (dataIndex === socialIndexes?.last) {
            lines.push('🔎 Last Seen');
          } else if (dataIndex === socialIndexes?.first) {
            lines.push('🔎 First Mention');
          }
          if (dataIndex === socialIndexes?.max) {
            lines.push('🟢 Biggest Pump');
          } else if (dataIndex === socialIndexes?.min) {
            lines.push('🔴 Biggest Dump');
          }
          const [buys, sells] = [
            whalesActivity?.[dataIndex].buys_number ?? 0,
            whalesActivity?.[dataIndex].sells_number ?? 0,
          ];
          if (buys) {
            lines.push(`🟢 +${buys} Buy`);
          }
          if (sells) {
            lines.push(`🔴 +${sells} Sell`);
          }

          if (lines.length > 2) {
            lines = [
              ...lines.slice(0, 2),
              '-'.repeat(40),
              lines.slice(2).join(' ‌  ‌ '),
            ];
          }

          return lines.join('<br>');
        },
      },
      backgroundColor: 'transparent',
    };
  }, [socialIndexes, value, whalesActivity]);

  return (
    <ECharts
      key={JSON.stringify(value)}
      initOptions={{
        height: 90,
      }}
      {...props}
      options={chartConfig}
    />
  );
};
