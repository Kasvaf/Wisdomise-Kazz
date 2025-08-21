import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export interface AlertCrumb {
  label?: ReactNode;
  action?: () => void;
}

export function AlertBreadcrumb({
  crumbs,
  className,
}: {
  crumbs: AlertCrumb[];
  className?: string;
}) {
  return (
    <ul
      className={clsx(
        'scrollbar-none flex grow items-center justify-start gap-1 overflow-auto whitespace-nowrap font-light text-xs',
        '[&_li]:after:ms-1 [&_li]:after:inline-block [&_li]:after:content-["/"]',
        '[&_li]:cursor-pointer [&_li]:text-v1-content-secondary',
        '[&_li:last-child]:cursor-default [&_li:last-child]:text-v1-content-primary [&_li:last-child]:after:hidden',
        className,
      )}
    >
      {crumbs.map((crumb, index) => (
        <li
          key={`crumb-${index}`}
          onClick={() => {
            crumb.action?.();
          }}
        >
          {crumb.label}
        </li>
      ))}
    </ul>
  );
}
