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
    return {
      data: [...(whale?.data?.last_30_days_pnls ?? [])].sort(
        (a, b) =>
          new Date(a.related_at_date).getTime() -
          new Date(b.related_at_date).getTime(),
      ),
      xField: 'related_at_date',
      yField: 'last_30_days_trading_pnl',
      padding: 'auto',
      connectNulls: true,
      color: '#727272',
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
          value: `${formatNumber(dt.last_30_days_trading_pnl, {
            compactInteger: true,
            decimalLength: 1,
            minifyDecimalRepeats: true,
            seperateByComma: true,
          })}%`,
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
          end: ['max', '-999'],
          color: '#F14056',
        },
        {
          type: 'regionFilter',
          start: ['min', '0'],
          end: ['max', '999'],
          color: '#00DA98',
        },
      ],
      smooth: true,
      autoFit: true,
      loading: whale.isLoading,
      height: 170,
    };
  }, [t, whale]);

  return (
    <OverviewWidget
      className={clsx('min-h-[250px]', className)}
      loading={whale.isLoading}
      empty={!whale.data?.holder_address}
      title={t('whale_historical_pnl.title')}
    >
      <Line {...config} />
    </OverviewWidget>
  );
}
