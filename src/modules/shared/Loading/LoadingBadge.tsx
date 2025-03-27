import { clsx } from 'clsx';
import { type FC } from 'react';

export const LoadingBadge: FC<{
  value?: boolean;
  className?: string;
  text?: string;
}> = ({ value, className, text = 'Updating…' }) => (
  <div
    className={clsx(
      'pointer-events-none inline-flex h-4 items-center justify-center gap-1',
      !value && 'hidden',
      className,
    )}
  >
    <div
      className={clsx(
        'size-3 shrink-0 animate-spin rounded-full border border-white/10 border-r-white border-t-white',
      )}
      style={{
        animationDuration: '0.75s',
      }}
    />
    {text && (
      <div className={clsx('truncate align-baseline text-xxs font-normal')}>
        {text}
      </div>
    )}
  </div>
);
