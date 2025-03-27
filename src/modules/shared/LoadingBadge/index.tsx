import { clsx } from 'clsx';
import { type FC } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';

export const LoadingBadge: FC<{
  value?: boolean;
  className?: string;
  animation: 'fade' | 'slide-down';
}> = ({ value, className, animation }) => {
  const { t } = useTranslation('common');
  return (
    <div
      className={clsx(
        'pointer-events-none inline-flex h-6 items-center justify-center gap-2 overflow-hidden rounded-full px-2 backdrop-blur-sm transition-all',
        !value && animation === 'fade' && 'opacity-0',
        !value && animation === 'slide-down' && 'translate-y-full opacity-0',
        className,
      )}
    >
      <div className="size-3 animate-spin rounded-full border border-transparent border-t-white" />
      <p className="text-xxs">{t('updating')}</p>
    </div>
  );
};

export * from './useLoadingBadge';
