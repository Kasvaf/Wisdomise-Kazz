import { Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import BetaVersion from 'shared/BetaVersion';
import { ReactComponent as EmptyIcon } from './empty.svg';

export function OverviewWidget({
  id,
  title,
  subtitle,
  info,
  badge,
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
  badge?: 'beta' | 'new';
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
      <Icon name={bxInfoCircle} size={18} className="cursor-help" />
    </Tooltip>
  );
  const badgeIcon = badge && <BetaVersion variant={badge} minimal />;
  return (
    <article
      className={clsx(
        'flex flex-col gap-6 overflow-hidden rounded-2xl bg-v1-surface-l2',
        'p-5 2xl:p-6',
        className,
      )}
      id={id}
    >
      {(title || info || headerActions) && (
        <header
          className={clsx(
            'flex shrink-0 items-center justify-between gap-6 overflow-visible text-v1-content-primary',
            '-mx-5 px-5 2xl:-mx-6 2xl:px-6',
            headerClassName,
          )}
        >
          {(title || info || subtitle) && (
            <div>
              {(title || info) && (
                <h2 className="flex items-center gap-2 text-base font-medium">
                  {title}
                  {badgeIcon}
                  {infoIcon}
                </h2>
              )}
              {subtitle && (
                <p className="mt-2 text-xs font-normal text-v1-content-secondary">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {headerActions}
        </header>
      )}
      <div
        className={clsx(
          'relative h-auto grow overflow-auto',
          '-mx-5 px-5 2xl:-mx-6 2xl:px-6',
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
            '-mx-5 px-5 2xl:-mx-6 2xl:px-6',
            footerClassName,
          )}
        >
          {footer}
        </footer>
      )}
    </article>
  );
}
