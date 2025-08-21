import type * as Sentry from '@sentry/react';
import { bxRefresh, bxsFaceMask } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { isDebugMode } from 'utils/version';

export default function PageError({
  errorObject,
  level,
}: {
  errorObject?: Parameters<Sentry.FallbackRender>[0];
  level?: 'root' | 'router';
}) {
  const { t } = useTranslation('base');

  const handleClick = () => {
    if (isDebugMode) {
      if (
        typeof errorObject === 'object' &&
        errorObject &&
        'error' in errorObject &&
        errorObject?.error instanceof Error
      ) {
        console.log('ERROR', level, errorObject);
        throw errorObject.error;
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen w-screen select-none flex-col items-center justify-center gap-4 text-v1-content-primary">
      <div className="mb-6 text-8xl">:(</div>
      <div className="text-center">{t('error-page.title')}</div>
      <div className="text-center text-sm text-v1-content-secondary">
        {t('error-page.subtitle')}
      </div>
      <button
        className={clsx(
          'flex items-center gap-2',
          isDebugMode && 'text-v1-content-negative',
        )}
        onClick={handleClick}
      >
        <Icon name={isDebugMode ? bxsFaceMask : bxRefresh} />
        {isDebugMode ? t('error-page.throw') : t('error-page.btn-reload')}
      </button>
    </div>
  );
}
