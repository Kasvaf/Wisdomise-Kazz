import { clsx } from 'clsx';
import { useMemo, type FC } from 'react';
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

  return (
    <div
      className={clsx(
        'inline-flex',
        inline
          ? 'items-center justify-start gap-px'
          : 'w-6 flex-col items-center justify-between',
        className,
      )}
    >
      <ClockIcon className={clsx('shrink-0', imgClassName)} />
      <ReadableDate value={timestap} suffix={false} popup={false} />
    </div>
  );
};
