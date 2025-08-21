import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export function StatusChip({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        className,
        'w-max rounded-3xl border border-v1-inverse-overlay-5 bg-v1-inverse-overlay-5 px-3 py-2 backdrop-blur',
      )}
    >
      {children}
    </div>
  );
}
