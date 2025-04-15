import { clsx } from 'clsx';
import { type FC } from 'react';
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
        'pointer-events-none inline-flex h-6 items-center justify-center gap-[5px] overflow-hidden rounded-full px-2 backdrop-blur-sm transition-all duration-500',
        'bg-v1-surface-l4',
        !value && animation === 'fade' && 'invisible opacity-0',
        !value &&
          animation === 'slide-down' &&
          'invisible translate-y-[calc(100%+2rem)]',
        className,
      )}
    >
      <div
        className="size-3 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
        style={{
          animationDuration: '0.5s',
        }}
      />
      <p className="truncate text-xxs font-medium">{t('updating')}</p>
    </div>
  );
};

export * from './useLoadingBadge';
