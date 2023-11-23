import { bxsDownArrow } from 'boxicons-quasar';
import { type ECharts } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { type StrategyPosition, type Candle } from 'api';
import { echartsDark, type EChartsOption } from 'modules/shared/echarts';

const upColor = '#ec0000';
const downColor = '#00da3c';
const enterColor = '#11C37E';
const exitColor = '#F14056';
const signalColor = '#fff';
const arrowSymbol = 'path://' + bxsDownArrow;

function splitData(candles: Candle[]) {
  const categoryData = [];
  const values = [];
  for (const candle of candles) {
    categoryData.push(candle.related_at);
    values.push([candle.open, candle.close, candle.low, candle.high]);
  }
  return {
    categoryData,
    values,
  };
}

const makeOption = (candles: Candle[]) => {
  const data0 = splitData(candles);

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
      left: '10%',
      right: '10%',
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
      data: data0.categoryData,
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
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: 'charts data',
        type: 'candlestick',
        data: data0.values,
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
          data: [
            marker(['2013/4/19', 2245], -1, enterColor),
            marker(['2013/5/6', 2212], 1, exitColor),
            marker(['2013/5/16', 2220], 1, signalColor),
            marker(['2013/5/17', 2250], 1, enterColor),
            marker(['2013/5/31', 2320], -1, exitColor),
          ],
        },
        markLine: {
          symbol: ['none', 'arrow'],
          symbolSize: 7,
          data: [
            liner(['2013/5/17', 2250], ['2013/5/31', 2320], '#fff'),
            liner(['2013/4/19', 2245], ['2013/5/6', 2212], '#fff'),
          ],
        },

        markArea: {
          silent: true,
          itemStyle: {
            opacity: 0.1,
            color: '#000',
          },
          data: [
            [
              {
                xAxis: '2013/5/17',
                yAxis: 2250,
                itemStyle: {
                  color: '#00ff00',
                },
              },
              {
                xAxis: '2013/5/31',
                yAxis: 2320,
              },
            ],
            [
              {
                xAxis: '2013/4/19',
                yAxis: 2245,
                itemStyle: {
                  color: '#ff0000',
                },
              },
              {
                xAxis: '2013/5/6',
                yAxis: 2212,
              },
            ],
          ],
        },
      },
    ],
  } satisfies EChartsOption;
};

function marker(coord: [string, number], dir: 1 | -1, color: string) {
  return {
    name: 'Mark',
    coord,
    value: coord[1],
    symbolSize: 15,
    symbol: arrowSymbol,
    symbolRotate: dir > 0 ? 180 : 0,
    symbolOffset: [0, dir * 10],
    label: {
      offset: [0, dir * 15],
      color: '#ffffff',
    },
    itemStyle: {
      color,
    },
  };
}

function liner(x: [string, number], y: [string, number], color: string) {
  return [
    {
      coord: x,
      lineStyle: { color },
    },
    {
      coord: y,
    },
  ] as any;
}

const CandleChart: React.FC<{
  candles: Candle[];
  positions?: StrategyPosition[];
}> = ({ candles }) => {
  const handler = (chart: ECharts) => {
    chart.dispatchAction({
      type: 'brush',
      areas: [
        {
          brushType: 'lineX',
          coordRange: ['2013/5/17', '2013/5/31'],
          xAxisIndex: 0,
        },
        {
          brushType: 'lineX',
          coordRange: ['2013/4/19', '2013/5/6'],
          xAxisIndex: 0,
        },
      ],
    });
  };

  return (
    <ReactECharts
      option={makeOption(candles)}
      notMerge={true}
      lazyUpdate={true}
      theme={echartsDark()}
      onChartReady={handler}
      style={{ height: '600px' }}
    />
  );
};

export default CandleChart;
