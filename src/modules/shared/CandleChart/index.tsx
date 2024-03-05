import { type ECharts } from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  type MarkLineOption,
  type MarkAreaOption,
  type MarkPointOption,
} from 'echarts/types/dist/shared';
import { useEffect, useState } from 'react';
import { type Candle, type Resolution } from 'api';
import { echartsDark, type EChartsOption } from './echarts';
import { type ChartPosition, parseCandles, parsePositions } from './utils';

const upColor = '#00da3c';
const downColor = '#ec0000';

const makeOption = (
  candles: {
    categoryData: string[];
    values: number[][];
  },
  positions: {
    areas: MarkAreaOption['data'];
    lines: MarkLineOption['data'];
    points: MarkPointOption['data'];
  },
) => {
  return {
    toolbox: {
      show: false,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      top: '5%',
      left: '5%',
      right: '5%',
      bottom: '15%',
    },
    brush: {
      xAxisIndex: 'all',
      brushLink: 'all',
      transformable: false,
      outOfBrush: {
        colorAlpha: 0.1,
      },
      brushStyle: {
        borderWidth: 0,
        color: 'rgba(255,255,255,0.05)',
      },
    },
    xAxis: {
      type: 'category',
      data: candles.categoryData,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true,
      },
    },
    dataZoom: [
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: Math.round(100 * (1 - 200 / candles.values.length)),
        end: 100,
      },
    ],
    series: [
      {
        name: 'charts data',
        type: 'candlestick',
        data: candles.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
        markPoint: {
          label: {
            formatter: function (param: any) {
              return param == null ? '' : String(Math.round(param.value));
            },
          },
          data: positions.points,
        },
        markLine: {
          symbol: ['none', 'arrow'],
          symbolSize: 7,
          data: positions.lines,
          tooltip: {
            trigger: 'item',
            valueFormatter(p) {
              return 'PnL: ' + String(p);
            },
          },
        },

        markArea: {
          silent: true,
          itemStyle: {
            opacity: 0.1,
            color: '#000',
          },
          data: positions.areas,
        },
      },
    ],
  } satisfies EChartsOption;
};

const CandleChart: React.FC<{
  candles: Candle[];
  positions?: ChartPosition[];
  resolution: Resolution;
}> = ({ candles, positions = [], resolution = '1h' }) => {
  const parsedCandles = parseCandles(candles, resolution);
  const parsedPositions = parsePositions(
    positions,
    resolution,
    parsedCandles.categoryData.at(-1),
  );

  const [chart, setChart] = useState<ECharts>();
  useEffect(() => {
    chart?.dispatchAction({
      type: 'brush',
      areas: parsedPositions.brushes,
    });
  }, [chart, parsedPositions.brushes]);

  return (
    <ReactECharts
      option={makeOption(parsedCandles, parsedPositions)}
      notMerge={true}
      lazyUpdate={true}
      theme={echartsDark()}
      onChartReady={setChart}
      style={{ height: '600px' }}
    />
  );
};

export default CandleChart;
