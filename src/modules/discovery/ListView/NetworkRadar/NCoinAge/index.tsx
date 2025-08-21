import { clsx } from 'clsx';
import { type FC, useMemo } from 'react';
import { ReadableDate } from 'shared/ReadableDate';
import { ReactComponent as ClockIcon } from './clock.svg';

export const NCoinAge: FC<{
  className?: string;
  imgClassName?: string;
  value?: string | null;
  inline?: boolean;
}> = ({ className, imgClassName, inline, value }) => {
  const timestap = useMemo(
    () => (value ? new Date(value).getTime() : null),
    [value],
  );

  const isNew = (timestap ?? 0) + 1000 * 60 * 60 > Date.now();

  return (
    <div
      className={clsx(
        'inline-flex',
        inline
          ? 'items-center justify-start gap-px'
          : 'w-6 flex-col items-center justify-between',
        isNew && 'text-v1-background-secondary',
        className,
      )}
    >
      <ClockIcon className={clsx('shrink-0', imgClassName)} />
      <ReadableDate popup={false} suffix={false} value={timestap} />
    </div>
  );
};
