import { Tooltip } from 'antd';
import { useWhaleDetails } from 'api/discovery';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';

export function WhaleNetflowChartWidget({
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
    const maxFlow = Math.max(maxInFlow, maxOutFlow);

    return {
      maxOutFlow,
      maxInFlow,
      maxFlow,
      data,
    };
  }, [whale]);

  if (whale.isLoading || !whale.data?.holder_address) return null;

  return (
    <>
      <div className={clsx(className)}>
        <h3 className="mb-4 font-semibold text-sm">
          {t('whale_netflow_histogram.title')}
        </h3>
        <div className="group relative flex h-[137px] w-fit min-w-full items-center justify-between gap-2">
          <div className="flex h-full w-auto flex-col justify-between text-v1-content-secondary text-xxs">
            <div>
              <div className="absolute mt-[7px] h-px w-full border-white/10 border-b border-dashed" />
              <ReadableNumber
                className="pr-1 backdrop-blur-3xl"
                label="$"
                value={config.maxFlow || 1000}
              />
            </div>
            <div>
              <div className="absolute mt-[7px] h-px w-full border-white/10 border-b border-dashed" />
              <ReadableNumber
                className="pr-2 backdrop-blur-3xl"
                label="$"
                value={0}
              />
            </div>
            <div>
              <div className="absolute mt-[7px] h-px w-full border-white/10 border-b border-dashed" />
              <ReadableNumber
                className="pr-1 backdrop-blur-3xl"
                label="$"
                value={config.maxFlow || 1000}
              />
            </div>
          </div>
          {config.data.map(r => (
            <Tooltip
              color="#151619"
              key={r.related_at_date}
              placement="right"
              title={
                <div className="p-1">
                  <ReadableDate
                    className="mb-1 block text-xs"
                    format="ddd, MMM D, YYYY"
                    popup={false}
                    value={r.related_at_date}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-v1-content-secondary text-xxs">
                      {t('whale_netflow_histogram.inflow')}:
                    </p>
                    <ReadableNumber
                      className="text-xs"
                      label="$"
                      value={r.today_in_flow}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-v1-content-secondary text-xxs">
                      {t('whale_netflow_histogram.outflow')}:
                    </p>
                    <ReadableNumber
                      className="text-xs"
                      label="$"
                      value={r.today_out_flow}
                    />
                  </div>
                </div>
              }
            >
              <div className="hover:!opacity-100 relative h-full w-2 shrink-0 overflow-visible transition-all group-hover:opacity-50">
                <div className="relative h-1/2">
                  <div
                    className="absolute bottom-0 min-h-1 w-full shrink-0 rounded-t bg-v1-content-positive"
                    style={{
                      height: `${
                        ((r.today_in_flow ?? 0) / config.maxFlow) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="relative h-1/2">
                  <div
                    className="absolute top-0 min-h-1 w-full shrink-0 rounded-b bg-v1-content-negative"
                    style={{
                      height: `${
                        ((r.today_out_flow ?? 0) / config.maxFlow) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
