import { Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { ReactComponent as EmptyIcon } from './empty.svg';

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
  empty,
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
  empty?: boolean;
}) {
  const { t } = useTranslation('common');
  const infoIcon = info && (
    <Tooltip title={info}>
      <Icon name={bxInfoCircle} size={18} />
    </Tooltip>
  );
  return (
    <article
      className={clsx(
        'flex flex-col gap-6 overflow-hidden rounded-2xl bg-v1-surface-l2',
        'p-6 mobile:p-5',
        className,
      )}
      id={id}
    >
      {(title || info || headerActions) && (
        <header
          className={clsx(
            'flex shrink-0 items-center justify-between gap-6 overflow-auto overflow-y-hidden whitespace-nowrap text-v1-content-primary',
            '-mx-6 px-6 mobile:-mx-5 mobile:px-5',
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
      <div
        className={clsx(
          'relative h-auto grow overflow-auto',
          '-mx-6 px-6 mobile:-mx-5 mobile:px-5',
          (loading || empty) && '!flex !items-center !justify-center py-4',
          contentClassName,
        )}
      >
        {loading ? (
          <p className="animate-pulse text-base text-v1-content-primary">
            {t('almost-there')}
          </p>
        ) : empty ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <EmptyIcon />
            <p className="text-xl text-v1-content-primary">
              {t('data-incoming')}
            </p>
            <p className="max-w-lg text-sm font-light text-v1-content-secondary">
              {t('data-incoming-description')}
            </p>
          </div>
        ) : (
          <>{children}</>
        )}
      </div>
      {footer && (
        <footer
          className={clsx(
            'shrink-0 overflow-auto',
            '-mx-6 px-6 mobile:-mx-5 mobile:px-5',
            footerClassName,
          )}
        >
          {footer}
        </footer>
      )}
    </article>
  );
}
