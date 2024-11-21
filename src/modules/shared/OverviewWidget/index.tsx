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
  size?: 'small' | 'normal';
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
      <div
        className={clsx(
          'relative h-auto grow overflow-auto',
          '-mx-5 px-5 2xl:-mx-6 2xl:px-6',
          (loading || empty) && 'py-4',
          contentClassName,
        )}
      >
        {loading ? (
          <p className="flex h-full animate-pulse items-center justify-center text-base text-v1-content-primary">
            {t('almost-there')}
          </p>
        ) : emptyConfig.enabled ? (
          <div
            className={clsx(
              'flex w-full gap-4',
              emptyConfig?.size === 'small'
                ? 'flex-row items-center justify-start mobile:flex-col mobile:justify-center'
                : 'flex-col items-center justify-center text-center',
            )}
          >
            <EmptyIcon
              className={clsx(
                'mt-3 shrink-0',
                emptyConfig.size === 'small' ? 'w-20' : 'w-48',
              )}
            />
            <div
              className={clsx(
                'flex grow flex-col justify-center gap-1 mobile:text-center',
                emptyConfig.size === 'small'
                  ? 'items-start mobile:items-center'
                  : 'items-center',
              )}
            >
              {emptyConfig.title && (
                <p
                  className={clsx(
                    'text-v1-content-primary',
                    emptyConfig.size === 'small' ? 'text-base' : 'text-xl',
                  )}
                >
                  {emptyConfig.title}
                </p>
              )}
              {emptyConfig.subtitle && (
                <p
                  className={clsx(
                    'max-w-lg font-light text-v1-content-secondary',
                    emptyConfig.size === 'small' ? 'text-xs' : 'text-sm',
                  )}
                >
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
