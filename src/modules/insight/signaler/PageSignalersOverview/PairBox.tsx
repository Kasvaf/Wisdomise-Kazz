import { clsx } from 'clsx';
import { type PropsWithChildren, useMemo } from 'react';
import { Area, type AreaConfig } from '@ant-design/plots';
import { useSignalerPair, useSignalerPairDetails } from 'api';
import { roundSensible } from 'utils/numbers';
import useIsMobile from 'utils/useIsMobile';
import PairInfo from 'shared/PairInfo';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type PairDataFull } from 'api/types/strategy';
import RadarBrief from './RadarBrief';

const PairInfoLabel: React.FC<{ label: string; value?: number }> = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-white/70">{label}</div>
      <div>
        <ReadableNumber value={value} label="$" />
      </div>
    </div>
  );
};

const PairBox: React.FC<
  PropsWithChildren<{ pair: PairDataFull; className?: string }>
> = ({
  pair: {
    name: pairName,
    base: { name: symbolName },
  },
  children,
  className,
}) => {
  const isMobile = useIsMobile();
  const pair = useSignalerPair('FUTURES')(pairName);
  const { data: pairDetails } = useSignalerPairDetails(pairName);

  const data = pair?.time_window_prices.map((d, i) => ({
    x: i,
    y: d,
  }));

  const chartConfig = useMemo<AreaConfig | null>(() => {
    if (!data) return null;

    const isUpTrend = Number(data.at(-1)?.y) - Number(data.at(0)?.y) >= 0;
    const min = Math.min(...data.map(r => r.y));

    return {
      data,
      renderer: 'svg',
      tooltip: false,
      xField: 'x',
      yField: 'y',
      color: isUpTrend ? '#00DA98' : '#FF3939',
      smooth: true,
      height: 140,
      animation: false,

      xAxis: {
        range: [0, 1],
        label: null,
        line: null,
        grid: null,
      },
      yAxis: {
        min,
        label: {
          style: {
            opacity: 0.7,
          },
          formatter(x) {
            return roundSensible(Number(x));
          },
        },
        tickLine: null,
        grid: {
          line: {
            style: {
              opacity: 0.1,
            },
          },
        },
        line: null,
        range: [0, 1],
      },
      line: {
        size: 0.8,
      },
      areaStyle: () => {
        return {
          lineWidth: 0.1,
          fill: isUpTrend
            ? 'l(270) 0:#1f242db2 1:#4FBF674D'
            : 'l(270) 0:#1f242db2 1:#DF5F4D',
        };
      },
    };
  }, [data]);

  return (
    <div className={clsx('rounded-xl bg-black/40 p-6', className)}>
      <PairInfo name={pairName} className="!justify-start !p-0" />
      <div className="my-5 border-b border-white/5" />
      <div className="flex items-end justify-between">
        <div>
          <div className="mb-1 text-xs font-normal text-white/50">Price</div>
          <ReadableNumber
            className="text-2xl"
            label="$"
            value={pairDetails?.price_data.last_price}
          />
        </div>

        <PriceChange
          textClassName="!text-sm font-normal"
          value={pairDetails?.price_data.percent_change_24h}
          suffix="  (24h)"
        />
      </div>
      {!isMobile && (
        <>
          {chartConfig && <Area {...chartConfig} className="my-10" />}

          <PairInfoLabel
            label="Volume"
            value={pairDetails?.price_data.volume_24h}
          />
          <div className="my-3 border-b border-white/10" />
          <PairInfoLabel
            label="Market Cap"
            value={pairDetails?.price_data.market_cap}
          />

          <RadarBrief symbolName={symbolName} className="mt-4" />
        </>
      )}
      {children}
    </div>
  );
};

export default PairBox;
