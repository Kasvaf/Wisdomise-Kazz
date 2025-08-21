import { clsx } from 'clsx';
import { type FC, Fragment, type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

const StatCol: FC<{
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

const GreenRedChart: FC<{
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

export function NCoinStatsWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const { rawData } = useUnifiedCoinDetails({ slug });
  const [timeFramePrefix, setTimeFramePrefix] = useState<'total_' | ''>('');
  const { t } = useTranslation('network-radar');

  const data = useMemo<
    Array<{
      key: string;
      titles: [string, string, string];
      values: [number, number, number];
      label: string;
    }>
  >(() => {
    return [
      {
        key: 'txns',
        titles: [t('common.buy_sell'), t('common.buy'), t('common.sell')],
        values: [
          (rawData?.data2?.update?.[`${timeFramePrefix}num_buys`] ?? 0) +
            (rawData?.data2?.update?.[`${timeFramePrefix}num_sells`] ?? 0),
          rawData?.data2?.update?.[`${timeFramePrefix}num_buys`] ?? 0,
          rawData?.data2?.update?.[`${timeFramePrefix}num_sells`] ?? 0,
        ],
        label: '',
      },
      {
        key: 'volume',
        titles: [t('common.volume'), t('common.buy_vol'), t('common.sell_vol')],
        values: [
          rawData?.data2?.update?.[`${timeFramePrefix}trading_volume`].usd ?? 0,
          rawData?.data2?.update?.[`${timeFramePrefix}buy_volume`].usd ?? 0,
          rawData?.data2?.update?.[`${timeFramePrefix}sell_volume`].usd ?? 0,
        ],
        label: '$',
      },
    ];
  }, [rawData?.data2?.update, t, timeFramePrefix]);

  if (!rawData?.data2) return null;

  return (
    <div
      className={clsx(
        'grid grid-cols-[3.75rem_1px_1fr] gap-2 rounded-md bg-v1-surface-l2 p-3',
        className,
      )}
    >
      <div className="col-span-3 mb-1 flex items-center justify-end">
        <ButtonSelect
          onChange={setTimeFramePrefix}
          options={[
            { label: '24H', value: '' },
            { value: 'total_', label: 'All Time' },
          ]}
          size="xxs"
          value={timeFramePrefix}
          variant="white"
        />
      </div>
      {data.map(row => (
        <Fragment key={row.key}>
          <StatCol label={row.titles[0]}>
            <ReadableNumber
              format={{
                decimalLength: 1,
              }}
              label={row.label}
              popup="never"
              value={row.values[0]}
            />
          </StatCol>
          <div className="h-14 w-px bg-white/10" />
          <GreenRedChart
            titles={row.titles.slice(1) as [string, string]}
            values={row.values.slice(1) as [number, number]}
          />
        </Fragment>
      ))}
    </div>
  );
}
