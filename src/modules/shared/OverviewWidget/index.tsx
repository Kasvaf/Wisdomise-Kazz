import { Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import BetaVersion from 'shared/BetaVersion';
import { ReactComponent as EmptyIcon } from './empty.svg';
import { ReactComponent as ProIcon } from './pro.svg';
import { ReactComponent as RefreshIcon } from './refresh.svg';

interface EmptyConfig {
  enabled?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  refreshButton?: ReactNode;
}

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
  onRefresh,
  empty,
}: {
  id?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  info?: ReactNode;
  badge?: 'beta' | 'new' | 'pro';
  headerActions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  loading?: boolean;
  onRefresh?: () => void;
  empty?: boolean | EmptyConfig;
}) {
  const { t } = useTranslation('common');
  const infoIcon = info && (
    <Tooltip title={info}>
      <Icon name={bxInfoCircle} size={18} className="cursor-help" />
    </Tooltip>
  );
  const badgeIcon =
    badge === 'pro' ? (
      <ProIcon />
    ) : (
      badge && <BetaVersion variant={badge} minimal />
    );
  const emptyConfig = useMemo<EmptyConfig>(
    () => ({
      enabled: false,
      refreshButton: false,
      size: 'normal',
      title: t('data-incoming'),
      subtitle: t('data-incoming-description'),
      ...(typeof empty === 'object'
        ? empty
        : {
            enabled: empty === true,
          }),
    }),
    [empty, t],
  );
  return (
    <article
      className={clsx(
        'flex flex-col gap-6 overflow-hidden rounded-2xl bg-v1-surface-l2',
        'p-5 2xl:p-6',
        className,
      )}
      id={id}
    >
      {/* Header */}
      {(title || info || headerActions) && (
        <header
          className={clsx(
            'flex shrink-0 items-center justify-between gap-6 overflow-visible text-v1-content-primary',
            '-mx-5 px-5 2xl:-mx-6 2xl:px-6',
            headerClassName,
          )}
        >
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
          {headerActions}
        </header>
      )}

      {/* Content */}
      <div
        className={clsx(
          'relative h-auto grow overflow-auto',
          '-mx-5 px-5 2xl:-mx-6 2xl:px-6',
          !contentClassName?.includes('min-h-') && 'min-h-20',
          contentClassName,
        )}
      >
        {loading ? (
          <p
            className={clsx(
              'absolute inset-0 flex size-full animate-pulse items-center justify-center text-base text-v1-content-primary',
              'p-6',
            )}
          >
            {t('almost-there')}
          </p>
        ) : emptyConfig.enabled ? (
          <div
            className={clsx(
              'absolute inset-0 flex size-full p-6',
              'flex-row items-center justify-center gap-4 mobile:flex-col mobile:justify-center',
            )}
          >
            <EmptyIcon className="mt-3 w-20 shrink-0 mobile:mt-0" />
            <div
              className={clsx(
                'flex flex-col justify-center gap-1 mobile:text-center',
                'items-start mobile:items-center',
                emptyConfig.refreshButton && 'grow',
              )}
            >
              {emptyConfig.title && (
                <p className="text-base text-v1-content-primary">
                  {emptyConfig.title}
                </p>
              )}
              {emptyConfig.subtitle && (
                <p className="max-w-lg text-xs font-light text-v1-content-secondary">
                  {emptyConfig.subtitle}
                </p>
              )}
            </div>
            {emptyConfig.refreshButton && (
              <button
                onClick={onRefresh}
                className={clsx(
                  'flex items-center gap-2 text-sm font-bold text-v1-content-primary',
                  'transition-all hover:brightness-110 active:brightness-90',
                )}
              >
                <RefreshIcon /> {t('actions.refresh')}
              </button>
            )}
          </div>
        ) : (
          <>{children}</>
        )}
      </div>

      {/* Footer */}
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
