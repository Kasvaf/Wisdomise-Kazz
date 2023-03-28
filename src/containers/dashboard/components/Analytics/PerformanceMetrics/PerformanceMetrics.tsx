import { Tooltip } from 'antd';
import { FunctionComponent } from 'react';
import { ReactComponent as InfoIcon } from '@images/info.svg';

interface PerformanceMetricItem {
  title: string;
  value: string;
  info?: string;
}

export interface PerformanceMetricsProps {
  metrics?: PerformanceMetricItem[];
}

const PerformanceMetrics: FunctionComponent<PerformanceMetricsProps> = ({
  metrics,
}) => {
  return (
    <div className="dashboard-panel space-y-8">
      <p className="font-campton text-xl text-white">Performance Metrics</p>
      <div className="flex flex-col">
        {metrics &&
          metrics.map(({ title, value, info }) => {
            return (
              <div
                className="align-items-center flex  flex-row border-b-[1px] border-nodata/20 text-xs last:border-0 md:text-base"
                key={title}
              >
                <div className="my-3 flex w-1/2 flex-row items-center justify-start space-x-1  text-white/80 ">
                  <span>
                    {title}
                    {info && (
                      <Tooltip placement="top" title={info}>
                        <InfoIcon className="ml-1 inline-block h-4 fill-nodata md:h-fit" />
                      </Tooltip>
                    )}
                  </span>
                </div>
                <div className="my-3 flex w-1/2 flex-row items-center text-white/80">
                  {value}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
