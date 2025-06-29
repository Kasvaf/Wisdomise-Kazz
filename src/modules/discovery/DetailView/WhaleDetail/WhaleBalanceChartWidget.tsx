import { clsx } from 'clsx';
import { Area, type AreaConfig } from '@ant-design/plots';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useWhaleDetails } from 'api/discovery';
import { formatNumber } from 'utils/numbers';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';

export function WhaleBalanceChartWidget({
  className,
  holderAddress,
  networkName,
  hr,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
  hr?: boolean;
}) {
  const { t } = useTranslation('whale');
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const config = useMemo<AreaConfig>(() => {
    return {
      data: [...(whale?.data?.last_30_balance_updates ?? [])].sort(
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
            background: '#151619',
            color: '#fff',
            boxShadow: 'none',
            borderRadius: '0.25rem',
          },
        },
        title: dt => dayjs(dt).format('ddd, MMM D, YYYY'),
        formatter: dt => ({
          name: t('whale_balance_chart.balance'),
          value:
            '$' +
            formatNumber(dt.balance_usdt as number, {
              compactInteger: true,
              decimalLength: 3,
              minifyDecimalRepeats: true,
              separateByComma: true,
            }),
        }),
      },
      xAxis: {
        grid: null,
        label: null,
        line: null,
      },
      yAxis: {
        grid: null,
        label: null,
      },
      smooth: true,
      autoFit: true,
      loading: whale.isLoading,
      height: 170,
    };
  }, [whale, t]);

  if (whale.isLoading || !whale.data?.holder_address) return null;

  return (
    <>
      <div className={clsx('h-[317px] overflow-hidden', className)}>
        <h3 className="mb-4 text-sm font-semibold">
          {t('whale_balance_chart.title')}
        </h3>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-v1-content-secondary">
              {t('whale_balance_chart.current_balance')}
            </p>
            <ReadableNumber
              value={whale.data?.last_30_balance_updates?.[0]?.balance_usdt}
              label="$"
              className="block text-2xl"
            />
          </div>
          <div>
            <PriceChange
              value={whale.data?.last_30_days_balance_change_percentage}
              className="block text-sm"
            />
          </div>
        </div>
        <Area className="!-mx-6 2xl:!-mx-8" {...config} />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
