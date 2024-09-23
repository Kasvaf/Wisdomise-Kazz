import { bxChevronLeft } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import Icon from 'shared/Icon';

interface Crumb<T extends string> {
  value: T;
  label?: ReactNode;
  action?: () => void;
  hidden?: boolean;
  accessableWithBack?: boolean;
}

export function AlertBreadcrumb<T extends string>({
  crumbs,
  className,
}: {
  crumbs: Array<Crumb<T> | undefined | false | null>;
  className?: string;
}) {
  const nonNullishCrumbs = crumbs.filter(r => !!r);
  const showBack =
    nonNullishCrumbs.filter(r => r.accessableWithBack).length > 1;
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {showBack && (
        <button
          onClick={() => nonNullishCrumbs.at(-2)?.action?.()}
          className="size-9 shrink-0"
        >
          <Icon name={bxChevronLeft} size={32} />
        </button>
      )}
      <ul
        className={clsx(
          'flex grow items-center justify-start gap-1 text-xs font-light',
          '[&_li:last-child]:after:hidden [&_li]:after:ms-1 [&_li]:after:inline-block [&_li]:after:content-["/"]',
          '[&_li:last-child]:text-v1-content-primary [&_li]:cursor-pointer [&_li]:text-v1-content-secondary',
        )}
      >
        {nonNullishCrumbs
          .filter(crumb => !crumb.hidden)
          .map(crumb => (
            <li
              key={crumb.value}
              onClick={() => {
                crumb.action?.();
              }}
            >
              {crumb.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
