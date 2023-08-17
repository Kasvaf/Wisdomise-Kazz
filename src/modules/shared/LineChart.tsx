import { type FunctionComponent, useMemo } from 'react';
import { Line } from '@ant-design/plots';
import { floatData } from 'utils/numbers';
import Spinner from './Spinner';

interface LineChartProps {
  className?: string;
  chartData: any;
  loading?: boolean;
  title?: string;
}

const LineChart: FunctionComponent<LineChartProps> = ({
  className,
  chartData,
  loading,
  title,
}) => {
  const convertRowDataToChartData = useMemo(() => {
    const chartDataArray: any[] = [];
    chartData?.etf_benchmark.forEach((item: any) => {
      chartDataArray.push({
        date: item.d,
        value: floatData(
          ((item.v - chartData?.etf_benchmark[0].v) /
            chartData?.etf_benchmark[0].v) *
            100,
        ),
        category: title,
      });
    });
    chartData?.btc_benchmark.forEach((item: any) => {
      chartDataArray.push({
        date: item.d,
        value: floatData(
          ((item.v - chartData?.btc_benchmark[0].v) /
            chartData?.btc_benchmark[0].v) *
            100,
        ),
        category: 'BTC',
      });
    });

    chartData?.gold_benchmark.forEach((item: any) => {
      chartDataArray.push({
        date: item.d,
        value: floatData(
          ((item.v - chartData?.gold_benchmark[0].v) /
            chartData?.gold_benchmark[0].v) *
            100,
        ),
        category: 'Gold',
      });
    });
    chartData?.sp500_benchmark.forEach((item: any) => {
      chartDataArray.push({
        date: item.d,
        value: floatData(
          ((item.v - chartData?.sp500_benchmark[0].v) /
            chartData?.sp500_benchmark[0].v) *
            100,
        ),
        category: 'S&P 500',
      });
    });

    return chartDataArray;
  }, [chartData, title]);

  const [min, max] = useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    convertRowDataToChartData.forEach(d => {
      const v = Number.parseFloat(d.value);
      if (v < min) {
        min = v;
      }
      if (v > max) {
        max = v;
      }
    });

    return [min, max];
  }, [convertRowDataToChartData]);

  const config = {
    data: convertRowDataToChartData,
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
        formatter: (v: any) => {
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
  if (loading)
    return (
      <div className="flex w-full justify-center py-20">
        <Spinner />
      </div>
    );
  return (
    <>
      <Line {...config} className={className} />
    </>
  );
};

export default LineChart;
