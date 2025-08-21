import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';

export const Badge: FC<{
  variant?: 'brand' | 'positive';
  ticking?: boolean;
  children?: ReactNode;
  className?: string;
}> = ({ children, variant = 'positive', ticking, className }) => {
  return (
    <div
      className={clsx(
        'h-2xs rounded-full p-px font-normal text-xxs tracking-wider',
        variant === 'positive' && 'bg-v1-content-positive',
        variant === 'brand' && 'bg-brand-gradient',
        className,
      )}
    >
      <div
        className={clsx(
          'flex size-full items-center justify-center gap-1 rounded-full bg-v1-surface-l1/90 px-3',
        )}
      >
        {children}
        {ticking && (
          <div
            className={clsx(
              'ms-px size-[6px] animate-pulse rounded-full',
              variant === 'positive' && 'bg-v1-content-positive',
              variant === 'brand' && 'bg-brand-gradient',
            )}
          />
        )}
      </div>
    </div>
  );
};
