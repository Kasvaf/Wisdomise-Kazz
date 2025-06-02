import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNCoinDetails } from 'api/discovery';
import { ReadableNumber } from 'shared/ReadableNumber';
import { isDebugMode } from 'utils/version';

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
  const { t } = useTranslation('network-radar');

  if (!nCoin.data) return null;

  return (
    <div
      className={clsx(
        'grid grid-cols-[auto_1px_1fr] gap-x-2 gap-y-0 rounded-md bg-v1-surface-l2 p-3',
        className,
      )}
    >
      <StatCol label={t('common.buy_sell')}>
        <ReadableNumber
          value={
            (nCoin.data?.update?.total_num_buys ?? 0) +
            (nCoin.data?.update?.total_num_sells ?? 0)
          }
          popup="never"
        />
      </StatCol>
      <div className="h-14 w-px bg-white/10" />
      <GreenRedChart
        values={[
          nCoin.data?.update.total_num_buys ?? 0,
          nCoin.data?.update.total_num_sells ?? 0,
        ]}
        titles={[t('common.buy'), t('common.sell')]}
      />
      {isDebugMode && (
        <>
          <StatCol label={t('common.volume')}>{'TODO: Volume'}</StatCol>
          <div className="h-14 w-px bg-white/10" />
          <GreenRedChart values={[50, 50]} titles={['TODO', 'TODO2']} />

          <StatCol label={t('common.volume')}>{'TODO: Makers'}</StatCol>
          <div className="h-14 w-px bg-white/10" />
          <GreenRedChart values={[50, 50]} titles={['TODO', 'TODO2']} />
        </>
      )}
    </div>
  );
}
