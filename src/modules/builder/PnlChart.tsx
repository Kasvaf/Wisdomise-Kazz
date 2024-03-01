import dayjs from 'dayjs';
import { Area, type AreaConfig } from '@ant-design/plots';
import { useMemo } from 'react';
import { ensureZ } from 'utils/dates';

const grid = {
  line: {
    style: {
      lineWidth: 0.1,
    },
  },
};

const PnlChart: React.FC<{
  data: Array<{
    d: string;
    v: number;
  }>;
}> = ({ data }) => {
  const configs = useMemo<AreaConfig>(() => {
    const max = Math.max(...data.map(r => Math.abs(r.v)));
    const min = Math.min(...data.map(r => Math.abs(r.v)));

    return {
      data,
      renderer: 'svg',
      tooltip: false,
      xField: 'd',
      yField: 'v',
      smooth: true,

      xAxis: {
        range: [0, 1],
        label: {
          formatter(text) {
            const d = new Date(ensureZ(text));
            return dayjs(d).format('MMM D');
          },
        },
        grid,
        line: null,
      },
      yAxis: {
        min: min || -max || -100,
        max: max || -min || 100,
        grid,
        label: {
          formatter(text) {
            const num = +text;
            return num
              ? num < 0
                ? num.toFixed(0) + '%'
                : '+' + num.toFixed(0) + '%'
              : '0';
          },
        },
        range: [0, 1],
      },
      line: {
        size: 1.5,
        color: '#34A3DA',
      },
      areaStyle: () => ({
        fill: 'l(270) 0:#34A3DA 0.5:#00000000 1:#34A3DA',
      }),
    };
  }, [data]);

  return <Area {...configs} className="!h-full" />;
};

export default PnlChart;
