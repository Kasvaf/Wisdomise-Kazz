import { type ComponentProps, type FC } from 'react';
import { type EChartsOption } from 'echarts';
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { ECharts } from 'shared/ECharts';
import { type Candle } from 'api';

export const CoinMiniCandleChart: FC<
  Omit<ComponentProps<typeof ECharts>, 'options'> & {
    value: Candle[];
  }
> = ({ value, className, ...props }) => {
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
      options={chartConfig}
      className={clsx(
        '[&_canvas]:!cursor-default [&_svg]:!cursor-default',
        className,
      )}
      {...props}
    />
  );
};
