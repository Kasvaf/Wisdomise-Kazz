import type { FC, ReactNode } from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';

const _StatCol: FC<{
  children: ReactNode;
  label?: ReactNode;
}> = ({ children, label }) => {
  return (
    <div className="flex h-11 flex-col gap-1">
      <p className="text-v1-content-secondary text-xxs">{label}</p>
      <div className="text-xs">{children}</div>
    </div>
  );
};

const _GreenRedChart: FC<{
  values: [number, number];
  titles: [string, string];
  label?: string;
}> = ({ values, titles, label }) => {
  const percentage = (values[0] / (values[0] + values[1])) * 100;
  return (
    <div className="flex h-11 flex-col gap-1">
      <div className="flex items-start justify-between">
        {titles.map(title => (
          <p className="text-v1-content-secondary text-xxs" key={title}>
            {title}
          </p>
        ))}
      </div>
      <div className="flex items-start justify-between">
        {values.map((value, index) => (
          <ReadableNumber
            className="text-xs"
            format={{
              decimalLength: 1,
            }}
            key={titles[index]}
            label={label}
            popup="never"
            value={value}
          />
        ))}
      </div>
      <div className="flex h-1 w-full max-w-full grow gap-1 overflow-hidden rounded bg-v1-background-disabled">
        <div
          className="shrink-0 rounded bg-v1-content-positive"
          style={{
            flexBasis: `${percentage}%`,
          }}
        />
        <div className="min-w-1 shrink grow rounded bg-v1-content-negative" />
      </div>
    </div>
  );
};

export function NCoinStatsWidget(_: { className?: string }) {
  // TODO: @majid
  // const { symbol } = useUnifiedCoinDetails();
  // const [timeFramePrefix, setTimeFramePrefix] = useState<'total_' | ''>('');

  // return (
  //   <div
  //     className={clsx(
  //       'grid grid-cols-[3.75rem_1px_1fr] gap-2 rounded-md bg-v1-surface-l2 p-3',
  //       className,
  //     )}
  //   >
  //     <div className="col-span-3 mb-1 flex items-center justify-end">
  //       <ButtonSelect
  //         onChange={setTimeFramePrefix}
  //         options={[
  //           { label: '24H', value: '' },
  //           { value: 'total_', label: 'All Time' },
  //         ]}
  //         size="xxs"
  //         value={timeFramePrefix}
  //         variant="white"
  //       />
  //     </div>
  //     {data.map(row => (
  //       <Fragment key={row.key}>
  //         <StatCol label={row.titles[0]}>
  //           <ReadableNumber
  //             format={{
  //               decimalLength: 1,
  //             }}
  //             label={row.label}
  //             popup="never"
  //             value={row.values[0]}
  //           />
  //         </StatCol>
  //         <div className="h-14 w-px bg-white/10" />
  //         <GreenRedChart
  //           titles={row.titles.slice(1) as [string, string]}
  //           values={row.values.slice(1) as [number, number]}
  //         />
  //       </Fragment>
  //     ))}
  //   </div>
  // );
  return null;
}
