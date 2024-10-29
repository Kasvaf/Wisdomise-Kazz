import { bxRefresh, bxsFaceMask } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Icon from 'shared/Icon';
import { ReactComponent as ErrorUndraw } from './undraw.svg';

export default function PageError(props: unknown) {
  const { t } = useTranslation('base');
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    if (showDetails) {
      // eslint-disable-next-line no-console
      console.log(props);
      if (
        typeof props === 'object' &&
        props &&
        'error' in props &&
        props?.error instanceof Error
      ) {
        throw props.error;
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-white">
      <ErrorUndraw className="mb-10 h-auto w-full max-w-sm px-6" />
      <div className="text-center">{t('error-page.title')}</div>
      <div className="mb-6 mt-2 text-center text-sm text-white/70">
        {t('error-page.subtitle')}
      </div>

      <button
        className="flex items-center gap-2"
        onClick={handleClick}
        onContextMenu={() => setShowDetails(p => !p)}
      >
        <Icon name={showDetails ? bxsFaceMask : bxRefresh} />
        {showDetails ? t('error-page.throw') : t('error-page.btn-reload')}
      </button>
    </div>
  );
}
