import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useNow from 'utils/useNow';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import {
  AFTER_CHECKOUT_KEY,
  SUCCESSFUL_CHECKOUT_KEY,
} from 'modules/auth/constants';
import { useSubscription } from 'api';
import { ReactComponent as CongratsBG } from './images/congrats.svg';
import { ReactComponent as CongratsLogo } from './images/congrats-logo.svg';

export default function SuccessfulPaymentMessage() {
  const navigate = useNavigate();
  const { isActive } = useSubscription();
  const [searchParams] = useSearchParams();
  const [successShown, setSuccessShow] = useState(false);
  const [modal, showModal] = useModal(ModalContent, {
    width: '700px',
    centered: true,
  });

  useEffect(() => {
    const afterCheckout = searchParams.get(AFTER_CHECKOUT_KEY);
    if (afterCheckout) {
      sessionStorage.setItem(AFTER_CHECKOUT_KEY, afterCheckout);
    }

    if (
      searchParams.has(SUCCESSFUL_CHECKOUT_KEY) &&
      isActive &&
      !successShown
    ) {
      setSuccessShow(true);
      void showModal({}).then(() => navigate('/account/billing'));
    }
  }, [isActive, navigate, searchParams, showModal, successShown]);

  return modal;
}

const RESEND_TIMEOUT = 10;

function ModalContent({ onResolve }: { onResolve: VoidFunction }) {
  const now = useNow();
  const { t } = useTranslation('billing');
  const [ttl] = useState(Date.now() + RESEND_TIMEOUT * 1000);
  const afterCheckoutUrl = sessionStorage.getItem(AFTER_CHECKOUT_KEY);

  const contHandler = useCallback(() => {
    if (afterCheckoutUrl) {
      onResolve?.();
      window.location.href = afterCheckoutUrl;
    }
  }, [onResolve, afterCheckoutUrl]);

  useEffect(() => {
    if (ttl < now) {
      contHandler();
    }
  }, [afterCheckoutUrl, ttl, now, contHandler]);

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

        {afterCheckoutUrl && (
          <Button className="mt-5 mobile:w-full" onClick={contHandler}>
            {t('success-modal.btn-goto-athena')}
          </Button>
        )}
      </div>

      {afterCheckoutUrl && ttl > now && (
        <p className="mt-6 text-white/60">
          <Trans i18nKey="success-modal.redirecting-msg" ns="billing">
            Will Be Redirected in
            <strong className="text-white">
              (
              {{
                timeout: Math.min(
                  Math.floor((ttl - now) / 1000) + 1,
                  RESEND_TIMEOUT,
                ),
              }}
              )
            </strong>
            Seconds.
          </Trans>
        </p>
      )}
    </div>
  );
}
