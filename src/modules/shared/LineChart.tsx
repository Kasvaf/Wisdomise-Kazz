import { type FunctionComponent, useMemo } from 'react';
import { Line } from '@ant-design/plots';
import {
  type BackTestBenchmark,
  type BackTestDateValue,
} from 'api/ias/backtest';
import Spinner from './Spinner';

interface LineChartProps {
  className?: string;
  chartData?: BackTestBenchmark;
  loading?: boolean;
  title?: string;
}

const convertBenchmark = (category: string, bench: BackTestDateValue[]) =>
  bench.map(item => ({
    category,
    date: item.d,
    value: +(((item.v - bench[0].v) / bench[0].v) * 100).toFixed(2),
  }));

const LineChart: FunctionComponent<LineChartProps> = ({
  className,
  chartData,
  loading,
  title,
}) => {
  const convertedChartData = useMemo(() => {
    if (!chartData) return [];
    return [
      ...convertBenchmark(title || '', chartData.etf_benchmark),
      ...convertBenchmark('BTC', chartData.btc_benchmark),
      ...convertBenchmark('Gold', chartData.gold_benchmark),
      ...convertBenchmark('S&P 500', chartData.sp500_benchmark),
    ];
  }, [chartData, title]);

  const [min, max] = useMemo(() => {
    const values = convertedChartData.map(x => x.value);
    return [Math.min(...values), Math.max(...values)];
  }, [convertedChartData]);

  const config = {
    data: convertedChartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
      nice: true,
      line: { style: { stroke: '#212327' } },
    },
    yAxis: {
      label: {
        formatter: (v: string) => {
          return String(Number.parseInt(v)) + '%';
        },
      },
      line: { style: { stroke: 'rgba(255, 255, 255, 0.1)' } },
      grid: { line: { style: { stroke: 'rgba(255, 255, 255, 0.1)' } } },
      minLimit: min - 10,
      maxLimit: max + 10,
    },

    color: ['#13DEF2', '#E26CFF', '#DFB13B', '#7a7a7a'],
  };

  return loading ? (
    <div className="flex w-full justify-center py-20">
      <Spinner />
    </div>
  ) : (
    <Line {...config} className={className} />
  );
};

export default LineChart;
