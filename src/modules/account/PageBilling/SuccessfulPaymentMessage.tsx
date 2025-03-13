import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import { useSubscription } from 'api';
import { ReactComponent as CongratsBG } from './images/congrats.svg';
import { ReactComponent as CongratsLogo } from './images/congrats-logo.svg';

const SUCCESSFUL_CHECKOUT_KEY = 'successful_checkout';

export default function SuccessfulPaymentMessage() {
  const navigate = useNavigate();
  const { status } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const [successShown, setSuccessShow] = useState(false);
  const [modal, showModal] = useModal(ModalContent, {
    width: '700px',
    centered: true,
  });

  useEffect(() => {
    if (
      searchParams.has(SUCCESSFUL_CHECKOUT_KEY) &&
      status === 'active' &&
      !successShown
    ) {
      setSuccessShow(true);
      void showModal({}).then(() => {
        searchParams.delete(SUCCESSFUL_CHECKOUT_KEY);
        setSearchParams(searchParams);
        return true;
      });
    }
  }, [
    status,
    navigate,
    searchParams,
    showModal,
    successShown,
    setSearchParams,
  ]);

  return modal;
}

function ModalContent({ onResolve }: { onResolve: VoidFunction }) {
  const { t } = useTranslation('billing');

  return (
    <div className="mt-10 flex flex-col items-center text-white">
      <CongratsBG className="mb-12 motion-safe:animate-pulse" />
      <CongratsLogo className="absolute mt-8" />

      <h1>{t('success-modal.title')}</h1>
      <p className="mb-4 text-white/60">{t('success-modal.subtitle')}.</p>
      <div className="flex mobile:w-full mobile:flex-col sm:gap-8">
        <Button
          className="mt-5 border !bg-transparent !text-white mobile:w-full"
          onClick={onResolve}
        >
          {t('success-modal.btn-details')}
        </Button>
      </div>
    </div>
  );
}
