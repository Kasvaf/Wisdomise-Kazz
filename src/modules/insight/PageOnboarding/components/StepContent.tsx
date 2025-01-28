import { clsx } from 'clsx';
import { type ReactNode } from 'react';

export function StepContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('grow overflow-auto px-4 xl:pt-4', className)}>
      {children}
    </div>
  );
}
