import { clsx } from 'clsx';
import { useMemo } from 'react';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReadableDate } from 'shared/ReadableDate';

export function WhaleNetflowChartWidget({
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

  const config = useMemo(() => {
    const data = [...(whale?.data?.last_30_days_in_out_flow ?? [])].sort(
      (a, b) =>
        new Date(a.related_at_date).getTime() -
        new Date(b.related_at_date).getTime(),
    );
    const maxInFlow = Math.max(
      ...(whale?.data?.last_30_days_in_out_flow ?? []).map(
        r => r.today_in_flow ?? 0,
      ),
    );
    const maxOutFlow = Math.max(
      ...(whale?.data?.last_30_days_in_out_flow ?? []).map(
        r => r.today_out_flow ?? 0,
      ),
    );
    return {
      maxOutFlow,
      maxInFlow,
      data,
    };
  }, [whale]);

  // const config = useMemo<BidirectionalBarConfig>(() => {
  //   return {
  //     data: [...(whale?.data?.last_30_days_in_out_flow ?? [])].sort(
  //       (a, b) =>
  //         new Date(a.related_at_date).getTime() -
  //         new Date(b.related_at_date).getTime(),
  //     ),
  //     xField: 'related_at_date',
  //     yField: ['today_in_flow', 'today_out_flow'],
  //     // style: {
  //     //   fill: d => {
  //     //     if (d.groupKey === 'today_in_flow') return '#00FFA3';
  //     //     return '#F14056';
  //     //   },
  //     // },
  //     barStyle: d => {
  //       return {
  //         fill:
  //           d?.['series-field-key'] === 'today_out_flow'
  //             ? '#F14056'
  //             : '#00FFA3',
  //         lineCap: 'butt',
  //         lineJoin: 'round',
  //         lineDash: [1, 1],
  //       };
  //     },
  //     // label: false,
  //     // areaStyle: {
  //     //   fill: 'l(270) 0:#202227 1:#00DA98',
  //     // },
  //     layout: 'vertical',
  //     xAxis: {
  //       grid: null,
  //       label: null,
  //       // base: 10_000,
  //       // mask: 'salam',
  //       // nice: false,
  //       // title: {
  //       //   // offset: -100,
  //       //   // spacing: 0,
  //       //   // style: {
  //       //   //   height: 0,
  //       //   // },
  //       //   // position: 'bottom',
  //       //   text: '',
  //       // },
  //       // line: {
  //       //   style: {
  //       //     strokeOpacity: 0,
  //       //   },
  //       // },
  //     },
  //     yAxis: {
  //       today_in_flow: {
  //         grid: null,
  //         nice: true,
  //       },
  //       today_out_flow: {
  //         grid: null,
  //         nice: true,
  //         // type: 'cat',
  //       },

  //       // line: {
  //       //   style: {
  //       //     strokeOpacity: 0,
  //       //   },
  //       // },
  //       // form
  //     },
  //     smooth: true,
  //     autoFit: true,
  //     loading: whale.isLoading,
  //     legend: false,
  //     // height: 170,
  //   };
  // }, [whale]);

  return (
    <OverviewWidget
      className={clsx('min-h-[317px]', className)}
      loading={whale.isLoading}
      empty={!whale.data?.holder_address}
      title={t('whale_netflow_histogram.title')}
    >
      <div className="group relative flex h-full items-center justify-between gap-2">
        <div className="relative flex h-full w-auto flex-col justify-between text-xxs text-v1-content-secondary">
          {config.maxInFlow || config.maxOutFlow ? (
            <ReadableNumber
              label="$"
              value={config.maxInFlow || config.maxOutFlow}
            />
          ) : (
            <span />
          )}
          <ReadableNumber label="$" value={0} />
          {config.maxOutFlow || config.maxInFlow ? (
            <ReadableNumber
              label="$"
              value={config.maxOutFlow || config.maxInFlow}
            />
          ) : (
            <span />
          )}
        </div>
        {config.data.map(r => (
          <Tooltip
            key={r.related_at_date}
            color="#151619"
            title={
              <div className="p-1">
                <ReadableDate
                  className="mb-1 block text-xs"
                  value={r.related_at_date}
                  format="ddd, MMM D, YYYY"
                  popup={false}
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xxs text-v1-content-secondary">
                    {t('whale_netflow_histogram.inflow')}:
                  </p>
                  <ReadableNumber
                    value={r.today_in_flow}
                    label="$"
                    className="text-xs"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xxs text-v1-content-secondary">
                    {t('whale_netflow_histogram.outflow')}:
                  </p>
                  <ReadableNumber
                    value={r.today_out_flow}
                    label="$"
                    className="text-xs"
                  />
                </div>
              </div>
            }
            placement="right"
          >
            <div className="relative h-full w-2 shrink-0 overflow-visible transition-all hover:!opacity-100 group-hover:opacity-50">
              <div className="relative h-1/2">
                <div
                  className="absolute bottom-0 min-h-1 w-full shrink-0 rounded-t bg-v1-content-positive"
                  style={{
                    height: `${
                      ((r.today_in_flow ?? 0) / config.maxInFlow) * 100
                    }%`,
                  }}
                />
              </div>
              <div className="relative h-1/2">
                <div
                  className="absolute top-0 min-h-1 w-full shrink-0 rounded-b bg-v1-content-negative"
                  style={{
                    height: `${
                      ((r.today_out_flow ?? 0) / config.maxOutFlow) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
      {/* <BidirectionalBar {...config} /> */}
    </OverviewWidget>
  );
}
