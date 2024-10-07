import { clsx } from 'clsx';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import VerificationInput from 'react-verification-input';
import { GoogleLogin } from '@react-oauth/google';
import {
  useEmailLoginMutation,
  useGoogleLoginMutation,
  useVerifyEmailMutation,
} from 'api/auth';
import useNow from 'utils/useNow';
import useModal from 'shared/useModal';
import Spinner from 'shared/Spinner';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import Link from 'shared/Link';
import { REFERRER_CODE_KEY } from 'modules/account/PageRef';
import { ReactComponent as LoginBg } from './Login.svg';

const ModalLogin: React.FC<{
  onResolve?: (success: boolean) => void;
}> = ({ onResolve }) => {
  const { t } = useTranslation('auth');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [nonce, setNonce] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitTime, setSubmitTime] = useState(Date.now());
  const now = useNow();

  const { mutateAsync: emailLogin, isLoading: emailLoginLoading } =
    useEmailLoginMutation();
  const submitEmail = async () => {
    if (!/[\w.-]+@[\w.-]+\.\w+/.test(email)) {
      setFieldError(t('login.error-email'));
      return;
    }

    if (await emailLogin({ email })) {
      setSubmitTime(Date.now());
      setStep('code');
    }
  };

  const remTime = 120 - Math.floor((now - submitTime) / 1000);
  const remMinutes = Math.floor(remTime / 60);
  const remSeconds = remTime % 60;

  const { mutateAsync: verifyEmail, isLoading: verifyEmailLoading } =
    useVerifyEmailMutation();
  const submitCode = async () => {
    if (
      await verifyEmail({
        email,
        nonce,
        referrer_code: localStorage.getItem(REFERRER_CODE_KEY) ?? undefined,
      })
    ) {
      onResolve?.(true);
    } else {
      setFieldError(t('login.error-code'));
    }
  };

  const { mutateAsync: mutateGoogleLogin } = useGoogleLoginMutation();
  const googleHandler = async ({ credential }: { credential?: string }) => {
    if (
      credential &&
      (await mutateGoogleLogin({
        id_token: credential,
        referrer_code: localStorage.getItem(REFERRER_CODE_KEY) ?? undefined,
      }))
    ) {
      onResolve?.(true);
    }
  };

  const notice = (
    <p className="my-5 text-xs text-white/70">
      <Trans ns="auth" i18nKey="login.notice">
        By continuing, you agree to our
        <Link target="_blank" href="https://whitepaper.wisdomise.com/">
          Privacy Policy
        </Link>
        and
        <Link target="_blank" href="https://whitepaper.wisdomise.com/">
          Terms of Service
        </Link>
        .
      </Trans>
    </p>
  );

  const emailContent = (
    <div className="mr-6 flex grow flex-col">
      <h1 className="mb-5 text-xl font-medium">{t('login.step-1.title')}</h1>
      <p className="mb-9 text-xs text-white/70">
        <Trans ns="auth" i18nKey="login.step-1.subtitle">
          <span className="text-white">Log In</span> to your account to explore
          Wisdomise Pro and enjoy a
          <span className="text-white">14-day free trial</span> of powerful
          trading tools!
        </Trans>
      </p>

      <div>
        <TextBox
          label={t('login.step-1.field-email')}
          value={email}
          onChange={x => {
            setEmail(x);
            setFieldError('');
          }}
          onKeyDown={e => {
            if (
              e.key === 'Enter' &&
              !e.altKey &&
              !e.ctrlKey &&
              !e.shiftKey &&
              !e.metaKey
            ) {
              void submitEmail();
            }
          }}
          type="email"
          error={fieldError}
        />
      </div>

      <div className="my-8 border-b border-v1-inverse-overlay-10" />

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={googleHandler}
          theme="filled_blue"
          use_fedcm_for_prompt
        />
      </div>

      <div className="grow" />

      {notice}
      <Button
        variant="primary-purple"
        onClick={submitEmail}
        loading={emailLoginLoading}
      >
        {t('common:actions.next')}
      </Button>
    </div>
  );

  const codeContent = (
    <div className="mr-6 flex grow flex-col">
      <h1 className="mb-5 text-xl font-medium">{t('login.step-2.title')}</h1>
      <p className="mb-9 text-xs text-white/70">
        {t('login.step-2.subtitle', { email })}
      </p>

      <div>
        <div className="mb-3 text-xs">{t('login.step-2.field-nonce')}</div>
        <VerificationInput
          validChars="0-9"
          placeholder=" "
          classNames={{
            character: clsx(
              'rounded-lg border-transparent bg-v1-surface-l2 text-white',
            ),
            characterSelected: clsx(
              'border border-white bg-v1-surface-l3 outline-none',
            ),
            container: clsx('w-full gap-4'),
          }}
          value={nonce}
          onChange={setNonce}
        />
        {fieldError && <div className="ml-1 mt-3 text-error">{fieldError}</div>}
        <div className="mx-1 mt-3 flex justify-between text-xs">
          {remTime > 0 ? (
            <div>
              {remMinutes.toString().padStart(2, '0')}:
              {remSeconds.toString().padStart(2, '0')}
            </div>
          ) : (
            <div />
          )}

          <Button
            variant="link"
            className="!p-0"
            disabled={remTime > 0}
            onClick={submitEmail}
            loading={emailLoginLoading}
          >
            {t('login.step-2.btn-resend')}
          </Button>
        </div>
      </div>

      <div className="grow" />

      <div
        className="mb-7 cursor-pointer text-v1-content-link hover:text-v1-content-link-hover"
        onClick={() => setStep('email')}
      >
        {t('login.step-2.btn-change-email')}
      </div>

      {notice}
      <Button
        variant="primary-purple"
        onClick={submitCode}
        loading={verifyEmailLoading}
      >
        {t('base:user.sign-in')}
      </Button>
    </div>
  );

  return (
    <div className="flex w-full">
      {emailLoginLoading || verifyEmailLoading ? (
        <div className="mr-6 flex grow flex-col items-center justify-center">
          <Spinner />
        </div>
      ) : step === 'email' ? (
        emailContent
      ) : (
        codeContent
      )}
      <LoginBg className="-my-5 -mr-7 w-[440px] shrink-0 mobile:hidden" />
    </div>
  );
};

export const useModalLogin = () => {
  const [Modal, showModal] = useModal(ModalLogin, {
    width: 880,
  });
  return [Modal, async () => !!(await showModal({}))] as const;
};

export default ModalLogin;
