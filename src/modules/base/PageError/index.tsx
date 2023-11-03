import { bxRefresh } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { ReactComponent as ErrorUndraw } from './undraw.svg';

const onReload = () => window.location.reload();
export default function PageError() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-white">
      <ErrorUndraw className="mb-10 h-auto w-full max-w-sm px-6" />
      <div className="text-center">{t('base.error-page.title')}</div>
      <div className="mb-6 mt-2 text-center text-sm text-white/70">
        {t('base.error-page.subtitle')}
      </div>

      <Button variant="primary" className="pl-4" onClick={onReload}>
        <Icon name={bxRefresh} className="mr-2" />
        {t('base.error-page.btn-reload')}
      </Button>
    </div>
  );
}
