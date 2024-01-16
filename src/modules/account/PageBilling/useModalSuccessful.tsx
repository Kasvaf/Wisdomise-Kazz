import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useNow from 'utils/useNow';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import { AFTER_CHECKOUT_KEY } from 'modules/auth/constants';
import { ReactComponent as CongratsBG } from './images/congrats.svg';
import { ReactComponent as CongratsLogo } from './images/congrats-logo.svg';

interface Props {
  onResolve?: () => void;
}

const RESEND_TIMEOUT = 10;

function ModalSuccessful({ onResolve }: Props) {
  const { t } = useTranslation('billing');
  const now = useNow();
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

export default function useModalSuccessful(
  p: Omit<Props, 'onResolve'>,
): [JSX.Element, () => Promise<boolean>] {
  const [Component, update] = useModal(ModalSuccessful, {
    width: '80ch',
    centered: true,
  });
  return [Component, async () => Boolean(await update(p))];
}
