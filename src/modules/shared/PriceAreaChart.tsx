import type React from 'react';
import { useMemo } from 'react';
import { Area, type AreaConfig } from '@ant-design/plots';

interface Props {
  data: AreaConfig['data'];
  height?: number;
}

const PriceAreaChart: React.FC<Props> = ({ data, height = 30 }) => {
  const configs = useMemo<AreaConfig>(() => {
    const isUpTrend = data.at(-1)?.y - data.at(0)?.y >= 0;
    const min = Math.min(...data.map(r => r.y));

    return {
      data,
      renderer: 'svg',
      tooltip: false,
      xField: 'x',
      yField: 'y',
      color: isUpTrend ? '#00DA98' : '#FF3939',
      smooth: true,
      height,

      xAxis: {
        range: [0, 1],
        label: null,
        line: null,
      },
      yAxis: {
        min,
        label: null,
        tickLine: null,
        grid: null,
        line: null,
        range: [0, 1],
      },
      line: {
        size: 0.8,
      },
      areaStyle: () => {
        return {
          fill: isUpTrend
            ? 'l(270) 0:#1f242db2 1:#4FBF674D'
            : 'l(270) 0:#1f242db2 1:#DF5F4D',
        };
      },
    };
  }, [data, height]);

  return <Area {...configs} />;
};

export default PriceAreaChart;
