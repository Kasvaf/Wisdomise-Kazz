import { Area, type AreaConfig } from '@ant-design/plots';
import * as numerable from 'numerable';

interface Props {
  title: string;
  xField: string;
  yField: string;
  theme?: 'purple' | 'blue';
  data: Array<Record<string, unknown>>;
}

export default function AreaChart({
  data,
  title,
  xField,
  yField,
  theme = 'blue',
}: Props) {
  const config: AreaConfig = {
    height: 140,
    yField,
    xField,
    tooltip: false,
    appendPadding: 5,
    data: data || [],
    yAxis: {
      label: {
        style: {
          fontSize: 9,
          fill: '#ffffff33',
        },
        formatter: v => numerable.format(v, '0,0.0 a'),
      },
      line: {
        style: {
          stroke: 'transparent',
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#ffffff0d',
          },
        },
      },
    },
    xAxis: {
      tickLine: {
        style: {
          stroke: 'transparent',
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#ffffff0d',
          },
        },
      },
      tickInterval: 4,
      line: {
        style: {
          stroke: '#ffffff0d',
        },
      },
      label: {
        style: {
          fontSize: 9,
          fill: '#ffffff33',
        },
        formatter: v => v.split('-')[1] + '-' + v.split('-')[2],
      },
    },

    color: theme === 'blue' ? '#34A3DA' : '#9747FF',
    areaStyle: () => {
      return {
        fill:
          theme === 'blue'
            ? 'l(270) 0:#308ce100 1:#308CE1'
            : 'l(270) 0:#308ce100 1:#9747FF',
      };
    },
  };

  return (
    <div className="rounded-lg bg-[#0A0B0D] p-3">
      <p className="mb-2 text-sm font-medium">{title}</p>
      <Area {...config} />
    </div>
  );
}
