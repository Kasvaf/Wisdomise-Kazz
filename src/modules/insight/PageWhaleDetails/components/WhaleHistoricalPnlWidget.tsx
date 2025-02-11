import { clsx } from 'clsx';
import { Line, type LineConfig } from '@ant-design/plots';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { formatNumber } from 'utils/numbers';

export function WhaleHistoricalPnlWidget({
  className,
  holderAddress,
  networkName,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
}) {
  const { t } = useTranslation('whale');
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const config = useMemo<LineConfig>(() => {
    const data = [...(whale?.data?.last_30_days_pnls ?? [])]
      .sort(
        (a, b) =>
          new Date(a.related_at_date).getTime() -
          new Date(b.related_at_date).getTime(),
      )
      .filter(r => r.related_at_date)
      .map(r => ({
        y: r.recent_trading_pnl ?? 0,
        x: r.related_at_date,
      }));
    return {
      data,
      xField: 'x',
      yField: 'y',
      padding: 'auto',
      connectNulls: true,
      color: '#00DA98',
      xAxis: {
        grid: null,
        label: {
          autoEllipsis: true,
          autoHide: true,
          autoRotate: false,
          formatter: text => dayjs(text).format('MMM D'),
          style: (_, index) =>
            index % 2 === 0
              ? {
                  fill: 'transparent',
                }
              : null,
        },
        line: null,
        nice: true,
        tickLine: null,
      },
      yAxis: {
        grid: null,
        label: null,
      },
      theme: 'light',
      tooltip: {
        title: dt => dayjs(dt).format('ddd, MMM D, YYYY'),
        formatter: dt => ({
          name: t('whale_historical_pnl.last_30_trading_pnl'),
          value: `$ ${formatNumber(dt.y, {
            compactInteger: true,
            decimalLength: 1,
            minifyDecimalRepeats: true,
            seperateByComma: true,
          })}`,
        }),
        domStyles: {
          'g2-tooltip': {
            background: '#151619',
            color: '#fff',
            boxShadow: 'none',
            borderRadius: '0.25rem',
          },
        },
      },
      annotations: [
        {
          type: 'regionFilter',
          start: ['min', '0'],
          end: ['max', 'min'],
          color: '#F14056',
        },
        // {
        //   type: 'regionFilter',
        //   start: ['min', '0'],
        //   end: ['max', 'max'],
        //   color: '#00DA98',
        // },
      ],
      smooth: true,
      autoFit: true,
      loading: whale.isLoading,
      height: 180,
    };
  }, [t, whale]);

  return (
    <OverviewWidget
      className={clsx('min-h-[250px]', className)}
      loading={whale.isLoading}
      empty={!whale.data?.holder_address}
      title={t('whale_historical_pnl.title')}
      badge="beta"
    >
      <Line {...config} />
    </OverviewWidget>
  );
}
