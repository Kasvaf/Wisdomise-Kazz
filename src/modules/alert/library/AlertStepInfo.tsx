import { clsx } from 'clsx';
import { type ReactNode } from 'react';

export function AlertStepInfo({
  className,
  content,
}: {
  className?: string;
  content?: ReactNode;
}) {
  return (
    <p
      className={clsx(
        'text-center text-xs font-light text-v1-content-secondary',
        className,
      )}
    >
      {content}
    </p>
  );
}
