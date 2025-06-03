import { clsx } from 'clsx';
import { Fragment, useMemo, useState, type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNCoinDetails } from 'api/discovery';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

const StatCol: FC<{
  children: ReactNode;
  label?: ReactNode;
}> = ({ children, label }) => {
  return (
    <div className="flex h-11 flex-col  gap-1">
      <p className="text-xxs text-v1-content-secondary">{label}</p>
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
          <p className="text-xxs text-v1-content-secondary" key={title}>
            {title}
          </p>
        ))}
      </div>
      <div className="flex items-start justify-between">
        {values.map((value, index) => (
          <ReadableNumber
            key={titles[index]}
            label={label}
            format={{
              decimalLength: 1,
            }}
            className="text-xs"
            value={value}
            popup="never"
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
  const nCoin = useNCoinDetails({ slug });
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
          (nCoin.data?.update?.[`${timeFramePrefix}num_buys`] ?? 0) +
            (nCoin.data?.update?.[`${timeFramePrefix}num_sells`] ?? 0),
          nCoin.data?.update?.[`${timeFramePrefix}num_buys`] ?? 0,
          nCoin.data?.update?.[`${timeFramePrefix}num_sells`] ?? 0,
        ],
        label: '',
      },
      {
        key: 'volume',
        titles: [t('common.volume'), t('common.buy_vol'), t('common.sell_vol')],
        values: [
          nCoin.data?.update?.[`${timeFramePrefix}trading_volume`].usd ?? 0,
          nCoin.data?.update?.[`${timeFramePrefix}buy_volume`].usd ?? 0,
          nCoin.data?.update?.[`${timeFramePrefix}sell_volume`].usd ?? 0,
        ],
        label: '$',
      },
    ];
  }, [nCoin.data?.update, t, timeFramePrefix]);

  if (!nCoin.data) return null;

  return (
    <div
      className={clsx(
        'grid grid-cols-[3.75rem_1px_1fr] gap-x-2 gap-y-0 rounded-md bg-v1-surface-l2 p-3',
        className,
      )}
    >
      <div className="col-span-3 mb-2 flex items-center justify-end">
        <ButtonSelect
          size="xxs"
          variant="white"
          options={[
            { label: '24H', value: '' },
            { value: 'total_', label: 'All Time' },
          ]}
          value={timeFramePrefix}
          onChange={setTimeFramePrefix}
        />
      </div>
      {data.map(row => (
        <Fragment key={row.key}>
          <StatCol label={row.titles[0]}>
            <ReadableNumber
              value={row.values[0]}
              label={row.label}
              popup="never"
              format={{
                decimalLength: 1,
              }}
            />
          </StatCol>
          <div className="h-14 w-px bg-white/10" />
          <GreenRedChart
            values={row.values.slice(1) as [number, number]}
            titles={row.titles.slice(1) as [string, string]}
          />
        </Fragment>
      ))}
    </div>
  );
}
