import { ResponsivePie } from '@nivo/pie';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useSPO } from './SPOProvider';

export const PieChart = () => {
  const { coins, performancePercentageMaxDD, isRefetching } = useSPO();

  const data = useMemo(
    () =>
      coins.map(c => ({
        id: c.asset,
        label: c.asset,
        color: c.color,
        value: c.weight,
      })),
    [coins],
  );

  return (
    <section className="relative h-full w-full text-xs text-black">
      <ResponsivePie
        key={coins.length}
        data={data}
        legends={[]}
        padAngle={1}
        cornerRadius={0}
        innerRadius={0.9}
        arcLabelsSkipAngle={13}
        enableArcLabels={false}
        activeInnerRadiusOffset={6}
        arcLinkLabelsSkipAngle={10}
        enableArcLinkLabels={false}
        colors={({ data: { color } }) => color}
      />

      <section className="absolute right-1/2 top-1/2 w-2/3 -translate-y-1/2 translate-x-1/2 text-center text-xs text-white max-md:text-[10px]">
        30 days with SPO improved your drawdown.{' '}
        <p
          className={clsx(
            'mt-3 text-lg font-bold max-md:text-base',
            performancePercentageMaxDD >= 0
              ? 'text-[#00FFA3]'
              : 'text-[#F23645]',
          )}
        >
          {isRefetching ? (
            <span className="text-sm text-white/70">Loading...</span>
          ) : (
            `${performancePercentageMaxDD.toFixed(2)}%`
          )}
        </p>
      </section>
    </section>
  );
};
