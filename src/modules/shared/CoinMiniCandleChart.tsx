import { type ComponentProps, type FC } from 'react';
import { type EChartsOption } from 'echarts';
import { useMemo } from 'react';
import { ECharts } from 'shared/ECharts';
import { type Candle } from 'api';

export const CoinMiniCandleChart: FC<
  Omit<ComponentProps<typeof ECharts>, 'options'> & {
    value: Candle[];
  }
> = ({ value, ...props }) => {
  const chartConfig = useMemo<EChartsOption>(() => {
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
        data: value.map(x => x.related_at),
        boundaryGap: false,
        show: false,
      },
      yAxis: {
        scale: true,
        show: false,
        boundaryGap: false,
      },
      tooltip: {
        show: false,
      },
      series: [
        {
          type: 'candlestick',
          data: value.map(row => [row.open, row.close, row.low, row.high]),
        },
      ],
      backgroundColor: 'transparent',
    };
  }, [value]);

  return (
    <ECharts
      key={JSON.stringify(value)}
      height={125}
      {...props}
      options={chartConfig}
    />
  );
};
