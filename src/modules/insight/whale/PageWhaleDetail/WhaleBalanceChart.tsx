import Area, { type AreaConfig } from '@ant-design/plots/es/components/area';
import { memo } from 'react';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { formatNumber } from 'utils/numbers';
import { type SingleWhale } from 'api';

export const WhaleBalanceChart = memo<{
  whale?: SingleWhale;
  className?: string;
}>(
  ({ whale, className }) => {
    const config: AreaConfig = {
      data: [...(whale?.last_30_balance_updates ?? [])].sort(
        (a, b) =>
          new Date(a.related_at_date).getTime() -
          new Date(b.related_at_date).getTime(),
      ),
      xField: 'related_at_date',
      yField: 'balance_usdt',
      color: '#00DA98',
      areaStyle: {
        fill: 'l(270) 0:#202227 1:#00DA98',
      },
      tooltip: {
        domStyles: {
          'g2-tooltip': {
            background: '#000',
            color: '#fff',
            boxShadow: 'none',
          },
        },
        formatter: dt => ({
          name: 'Balance',
          value:
            formatNumber(dt.balance_usdt as number, {
              compactInteger: true,
              decimalLength: 3,
              minifyDecimalRepeats: true,
              seperateByComma: true,
            }) + ' USDT',
        }),
      },
      xAxis: {
        grid: null,
        tickLine: {
          style: {
            strokeOpacity: 0,
            opacity: 0,
          },
        },
        label: {
          autoEllipsis: true,
          autoHide: true,
          autoRotate: false,
          offsetY: 18,
          formatter(text) {
            const day = dayjs(text);
            const now = dayjs(Date.now());
            return day.format(
              `MMM D${day.year() === now.year() ? '' : ', YY'}`,
            );
          },
        },
        line: {
          style: {
            strokeOpacity: 0,
          },
        },
      },
      yAxis: {
        grid: {
          line: {
            style: {
              opacity: 0.05,
            },
          },
        },
        label: {
          formatter(text) {
            return formatNumber(+text, {
              compactInteger: true,
              decimalLength: 2,
              minifyDecimalRepeats: false,
              seperateByComma: true,
            });
          },
        },
      },
      smooth: true,
      autoFit: true,
      loading: !whale,
      height: 350,
    };

    return (
      <div className={clsx('relative bg-[#202227] p-8', className)}>
        <Area {...config} />
      </div>
    );
  },
  (pre, post) => JSON.stringify(pre) === JSON.stringify(post),
);

WhaleBalanceChart.displayName = 'WhaleBalanceChart';
