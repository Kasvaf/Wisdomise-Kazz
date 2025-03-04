import { useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { type WhaleRadarSentiment } from 'api';
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
        className="absolute left-0 top-0 h-full min-w-1 rounded bg-v1-content-primary"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}

export const WRSProgress: FC<{
  value?: WhaleRadarSentiment['label_percents'] | null;
  className?: string;
}> = ({ value, className }) => {
  const list = useMemo(() => {
    let ret = [...(value ?? [])].sort((a, b) => a[1] - b[1]);
    while (ret.length > 4) {
      ret = ret.slice(1);
    }
    if (ret.length === 0) {
      ret = [
        ['unloading', 0],
        ['loading', 0],
        ['new_investment', 0],
        ['exit_portfolio', 0],
      ];
    }
    return ret;
  }, [value]);
  return (
    <div
      className={clsx(
        'grid grid-cols-2 items-center gap-x-2 gap-y-0 whitespace-nowrap',
        !value && 'grayscale',
        className,
      )}
    >
      {list.map(row => (
        <>
          <WhaleAssetBadge
            textOnly
            value={row[0]}
            className="overflow-hidden text-ellipsis text-xxs text-v1-content-secondary"
          />
          <Progress value={row[1]} />
        </>
      ))}
    </div>
  );
};
