import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as WisdomiseLogo } from '../../images/wisdomise-logo.svg';

export default function TransactionConfirmedModalContent() {
  const { t } = useTranslation('billing');
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) =>
      event.preventDefault();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-6 text-center">
      <WisdomiseLogo className="animate-pulse" />
      <h3 className="my-5 text-2xl text-white">
        {t('token-modal.confirmed.title')}
      </h3>
      <p>{t('token-modal.confirmed.description')}</p>
    </div>
  );
}
