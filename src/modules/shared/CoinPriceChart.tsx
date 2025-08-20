import { type ComponentProps, type FC } from 'react';
import { type EChartsOption } from 'echarts';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { formatNumber } from 'utils/numbers';
import { ECharts } from 'shared/ECharts';
import { type WhaleRadarCoin, type CoinSignalAnalysis } from 'api/discovery';

interface PriceRow {
  value: number;
  related_at: string;
}

type ExtendedPriceRow = PriceRow & {
  y: number;
  x: number;
  events: Array<{
    type: string;
    value?: number;
  }>;
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
    const extendedValue: ExtendedPriceRow[] = (value ?? []).map((row, i) => ({
      ...row,
      x: i,
      y: row.value * 1_000_000,
      events: [
        whalesActivity?.[i].buys_number
          ? {
              type: 'whale_buys',
              value: whalesActivity[i].buys_number,
            }
          : null,
        whalesActivity?.[i].sells_number
          ? {
              type: 'whale_sells',
              value: whalesActivity[i].sells_number,
            }
          : null,
        socialIndexes?.first === i
          ? {
              type: 'social_first_mention',
            }
          : null,
        socialIndexes?.last === i
          ? {
              type: 'social_last_mention',
            }
          : null,
        socialIndexes?.max === i
          ? {
              type: 'social_pump',
            }
          : null,
        socialIndexes?.min === i
          ? {
              type: 'social_dump',
            }
          : null,
      ].filter(r => r !== null),
    }));

    const ys = extendedValue.map(r => r.y);
    const [maxY, minY] = [Math.max(...ys), Math.min(...ys)];

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
        min: () => minY - (maxY - minY) * 0.5,
        max: () => maxY + (maxY - minY) * 0.5,
        show: false,
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
          symbol: 'circle',
          symbolSize: 0,
          showAllSymbol: false,
          label: {
            show: false,
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
          markPoint: {
            label: {
              color: '#fff',
              fontSize: 8,
              fontWeight: 'bold',
              padding: [-3, 0],
            },
            symbolSize: 9,
            data: extendedValue.flatMap((row, i) => {
              return row.events.map(evt => ({
                name: evt.type,
                symbol: evt.type.startsWith('whale_') ? 'triangle' : 'circle',
                symbolRotate: evt.type === 'whale_sells' ? 180 : 0,
                coord: [
                  i,
                  evt.type === 'whale_buys'
                    ? row.y - (maxY - minY) * 0.22
                    : evt.type === 'whale_sells'
                      ? row.y + (maxY - minY) * 0.22
                      : row.y,
                ],
                value:
                  evt.type === 'whale_buys'
                    ? `${evt.value ?? 0}`
                    : evt.type === 'whale_sells'
                      ? `${evt.value ?? 0}`
                      : undefined,
                itemStyle: {
                  color:
                    evt.type === 'whale_buys'
                      ? '#00FFA3'
                      : evt.type === 'whale_sells'
                        ? '#F14056'
                        : '#EEE',
                },
                label: {
                  position:
                    evt.type === 'whale_buys'
                      ? 'bottom'
                      : evt.type === 'whale_sells'
                        ? 'top'
                        : undefined,
                },
              }));
            }),
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
              separateByComma: true,
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
            lines.push(`🟢 ${buys} Buy`);
          }
          if (sells) {
            lines.push(`🔴 ${sells} Sell`);
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
      height={125}
      {...props}
      options={chartConfig}
    />
  );
};
