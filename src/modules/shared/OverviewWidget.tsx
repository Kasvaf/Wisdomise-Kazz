import { Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import Icon from 'shared/Icon';
import Spinner from './Spinner';

export function OverviewWidget({
  id,
  title,
  subtitle,
  info,
  headerActions,
  footer,
  children,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  loading,
}: {
  id?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  info?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  loading?: boolean;
}) {
  const infoIcon = info && (
    <Tooltip title={info}>
      <Icon name={bxInfoCircle} size={18} />
    </Tooltip>
  );
  return (
    <article
      className={clsx(
        'flex h-auto flex-col gap-6 rounded-2xl bg-v1-surface-l2 p-6',
        className,
      )}
      id={id}
    >
      {(title || info || headerActions) && (
        <header
          className={clsx(
            '-mx-6 flex shrink-0 items-center justify-between gap-6 overflow-auto overflow-y-hidden whitespace-nowrap px-6 text-v1-content-primary',
            headerClassName,
          )}
        >
          <div>
            {(title || info) && (
              <h2 className="flex items-center gap-1 text-base font-medium">
                {title}
                {infoIcon}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-xs font-normal text-v1-content-secondary">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions}
        </header>
      )}
      {loading ? (
        <div
          className={clsx(
            'relative flex h-auto items-center justify-center overflow-hidden p-10',
          )}
        >
          <Spinner />
        </div>
      ) : (
        children && (
          <div
            className={clsx(
              'relative -mx-6 h-auto overflow-auto px-6',
              contentClassName,
            )}
          >
            {children}
          </div>
        )
      )}
      {footer && (
        <footer
          className={clsx('-mx-6 shrink-0 overflow-auto px-6', footerClassName)}
        >
          {footer}
        </footer>
      )}
    </article>
  );
}
