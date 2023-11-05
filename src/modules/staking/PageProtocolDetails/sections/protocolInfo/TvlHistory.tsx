import { Area, type AreaConfig } from '@ant-design/plots';
import * as numerable from 'numerable';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useProtocolTvlHistory } from 'api/staking';

export default function TvlHistory() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation('staking');
  const tvlHistory = useProtocolTvlHistory(params.id);

  const config: AreaConfig = {
    height: 140,
    yField: 'tvl',
    xField: 'date',
    tooltip: false,
    appendPadding: 5,
    data: tvlHistory.data || [],
    yAxis: {
      label: {
        style: {
          fontSize: 9,
          fontFamily: 'poppins',
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
          fontFamily: 'poppins',
          fill: '#ffffff33',
        },
        formatter: v => v.split('-')[1] + '-' + v.split('-')[2],
      },
    },
    color: '#34A3DA',
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#308ce100 1:#308CE1',
      };
    },
  };

  return (
    <div className="rounded-lg bg-[#0A0B0D] p-3">
      <p className="mb-2 text-sm font-medium">{t('info.chart.tvl-history')}</p>
      <Area {...config} />
    </div>
  );
}
