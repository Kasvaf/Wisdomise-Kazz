import { Fragment, useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { type WhaleAssetLabel, type WhaleRadarSentiment } from 'api/discovery';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';

function Progress({ value }: { value: number }) {
  return (
    <div
      className={clsx(
        'relative h-2 w-full justify-self-end overflow-hidden rounded bg-v1-background-disabled',
        value === 0 && 'opacity-80',
      )}
    >
      <div
        className={clsx(
          'absolute left-0 top-0 h-full min-w-1 rounded',
          value > 0 ? 'bg-v1-content-primary' : 'bg-v1-content-primary/50',
        )}
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}

const FILLER_LABELS: WhaleAssetLabel[] = [
  'exit_portfolio',
  'new_investment',
  'loading',
  'unloading',
];

export const WRSProgress: FC<{
  value?: WhaleRadarSentiment['label_percents'] | null;
  className?: string;
}> = ({ value, className }) => {
  const list = useMemo(() => {
    let ret = [...(value ?? [])].sort((a, b) => a[1] - b[1]);
    while (ret.length > 4) {
      ret = ret.slice(1);
    }
    while (ret.length < 4) {
      ret = [
        [
          FILLER_LABELS.find(
            x => !ret.some(y => y[0] === x),
          ) as WhaleAssetLabel,
          0,
        ],
        ...ret,
      ];
    }
    return ret;
  }, [value]);
  return (
    <div
      className={clsx(
        'grid grid-cols-[1fr_2fr] items-center gap-x-2 gap-y-0',
        !value && 'grayscale',
        className,
      )}
    >
      {list.map(row => (
        <Fragment key={row[0]}>
          <WhaleAssetBadge
            textOnly
            value={row[0]}
            className="shrink truncate text-xxs text-v1-content-secondary"
          />
          <Progress value={row[1]} />
        </Fragment>
      ))}
    </div>
  );
};
