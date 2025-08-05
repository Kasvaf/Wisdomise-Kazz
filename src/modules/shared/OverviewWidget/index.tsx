import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import BetaVersion from 'shared/BetaVersion';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Button } from 'shared/v1-components/Button';
import { type Surface, useSurface } from 'utils/useSurface';
import { ReactComponent as EmptyIcon } from './empty.svg';
import { ReactComponent as ProIcon } from './pro.svg';
import { ReactComponent as RefreshIcon } from './refresh.svg';

interface EmptyConfig {
  enabled?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  refreshButton?: boolean;
}

const paddingClassName = clsx('p-5 mobile:p-3 2xl:p-6');
const gapClassName = clsx('gap-5 2xl:gap-6');

export function OverviewWidget({
  id,
  title,
  titleSuffix,
  subtitle,
  info,
  badge,
  headerActions,
  footer,
  children,
  overlay,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  loading,
  onRefresh,
  refreshing,
  empty,
  surface = 0,
}: {
  id?: string;
  title?: ReactNode;
  titleSuffix?: ReactNode;
  subtitle?: ReactNode;
  info?: ReactNode;
  badge?: 'beta' | 'new' | 'pro';
  headerActions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  overlay?: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  empty?: boolean | EmptyConfig;
  surface?: Surface;
}) {
  const colors = useSurface(surface);
  const { t } = useTranslation('common');
  const infoIcon = info && (
    <HoverTooltip title={info}>
      <Icon name={bxInfoCircle} size={18} className="cursor-help" />
    </HoverTooltip>
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
      style={{
        ['--widget-color' as never]: colors.next,
      }}
      className={clsx(
        'relative flex flex-col overflow-hidden rounded-2xl bg-(--widget-color)',
        gapClassName,
        paddingClassName,
        className,
      )}
      id={id}
    >
      {/* Header */}
      {(title || info || headerActions) && (
        <header
          className={clsx(
            'flex shrink-0 items-center justify-between gap-4 overflow-visible text-v1-content-primary',
            headerClassName,
          )}
        >
          {(title || info || subtitle) && (
            <div>
              {(title || info || titleSuffix) && (
                <div className="flex items-center gap-2 text-base font-medium">
                  {title}
                  {badgeIcon}
                  {infoIcon}
                  {titleSuffix}
                </div>
              )}
              {subtitle && (
                <div className="mt-2 text-xs font-normal text-v1-content-secondary">
                  {subtitle}
                </div>
              )}
            </div>
          )}
          <div className="shrink grow" />
          {headerActions}
        </header>
      )}

      {/* Content */}
      <div
        className={clsx(
          'relative h-auto min-h-20 grow overflow-auto scrollbar-none',
          contentClassName,
        )}
      >
        {loading ? (
          <p
            className={clsx(
              'absolute inset-0 flex size-full animate-pulse items-center justify-center overflow-hidden text-base text-v1-content-primary',
              paddingClassName,
            )}
          >
            {t('almost-there')}
          </p>
        ) : emptyConfig.enabled ? (
          <div
            className={clsx(
              'absolute inset-0 flex size-full max-h-full overflow-hidden',
              'flex-row items-center justify-center gap-4',
            )}
          >
            <EmptyIcon className="mt-3 h-auto w-20 shrink-0 mobile:-mb-3 mobile:mt-0 mobile:w-14" />
            <div
              className={clsx(
                'flex flex-col items-start justify-center gap-1',
                emptyConfig.refreshButton && 'grow',
              )}
            >
              {emptyConfig.title && (
                <p className="text-base text-v1-content-primary mobile:text-sm">
                  {emptyConfig.title}
                </p>
              )}
              {emptyConfig.subtitle && (
                <p className="max-w-lg text-xs font-light text-v1-content-secondary mobile:text-xxs">
                  {emptyConfig.subtitle}
                </p>
              )}
            </div>
            {emptyConfig.refreshButton && (
              <Button
                size="md"
                onClick={onRefresh}
                variant="ghost"
                surface={surface}
              >
                <RefreshIcon className={clsx(refreshing && 'animate-spin')} />{' '}
                {t('actions.refresh')}
              </Button>
            )}
          </div>
        ) : (
          <>{children}</>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <footer className={clsx('shrink-0 overflow-auto', footerClassName)}>
          {footer}
        </footer>
      )}

      {/* Overlay */}
      {overlay && (
        <div className={clsx('pointer-events-none absolute inset-0 size-full')}>
          {overlay}
        </div>
      )}
    </article>
  );
}
