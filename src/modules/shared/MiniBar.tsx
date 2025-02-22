import { clsx } from 'clsx';
import { type FC } from 'react';

export const MiniBar: FC<{
  className?: string;
  value: number; // -1 | 0 | 1
}> = ({ className, value }) => {
  const barValue = Math.round(Math.abs(value) * 3);
  return (
    <div
      className={clsx(
        'inline-flex h-5 w-[23px] items-end justify-between gap-[4px]',
        className,
      )}
    >
      {[1, 2, 3].map(size => (
        <div
          key={size}
          className={clsx(
            'w-[5px] shrink-0 rounded-full',
            size === 1 ? 'h-1/2' : size === 2 ? 'h-3/4' : 'h-full',
            barValue < size
              ? 'bg-white/10'
              : value < 0
              ? 'bg-v1-content-negative'
              : 'bg-v1-content-positive',
          )}
        ></div>
      ))}
    </div>
  );
};
