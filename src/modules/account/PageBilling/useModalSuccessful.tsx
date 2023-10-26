import { useCallback, useEffect, useState } from 'react';
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

      <h1>Thanks for subscribing</h1>
      <p className="mb-4 text-white/60">You can continue your journey.</p>
      <div className="max-sm:flex-col max-sm:w-full flex sm:gap-8">
        <Button
          className="max-sm:w-full mt-5 border !bg-transparent !text-white"
          onClick={onResolve}
        >
          Subscription Details
        </Button>

        {afterCheckoutUrl && (
          <Button className="max-sm:w-full mt-5" onClick={contHandler}>
            Go to Athena
          </Button>
        )}
      </div>

      {afterCheckoutUrl && ttl > now && (
        <p className="mt-6 text-white/60">
          Will Be Redirected in{' '}
          <strong className="text-white">
            {`(${Math.min(
              Math.floor((ttl - now) / 1000) + 1,
              RESEND_TIMEOUT,
            )})`}
          </strong>{' '}
          Seconds.
        </p>
      )}
    </div>
  );
}

export default function useModalSuccessful(
  p: Omit<IProps, 'onResolve'>,
): [JSX.Element, () => Promise<boolean>] {
  const [Component, update] = useModal(ModalSuccessful, {
    width: '80ch',
    centered: true,
  });
  return [Component, async () => Boolean(await update(p))];
}
