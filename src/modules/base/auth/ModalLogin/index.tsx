import { GoogleLogin } from '@react-oauth/google';
import {
  useEmailLoginMutation,
  useGoogleLoginMutation,
  useMiniAppTgLoginFromWebMutation,
  useVerifyEmailMutation,
} from 'api/auth';
import { ReactComponent as Logo } from 'assets/logo-green.svg';
import { bxArrowBack } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { DOCS_ORIGIN, TELEGRAM_BOT_BASE_URL } from 'config/constants';
import { REFERRER_CODE_KEY } from 'modules/base/Container/ReferrerListener';
import { useCallback, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import VerificationInput from 'react-verification-input';
import Icon from 'shared/Icon';
import Spinner from 'shared/Spinner';
import TextBox from 'shared/TextBox';
import { Button } from 'shared/v1-components/Button';
import { Dialog } from 'shared/v1-components/Dialog';
import EditableText from 'shared/v1-components/EditableText';
import useNow from 'utils/useNow';
import { v4 } from 'uuid';
import { ModalLoginSlides } from './ModalLoginSlides';
import TelegramLogin from './TelegramLogin';
import { useModalLoginTexts } from './useModalLoginTexts';

const LoginModalContent: React.FC<{
  onResolve?: (success: boolean) => void;
}> = ({ onResolve }) => {
  const { t } = useTranslation('auth');
  const { title, subtitle } = useModalLoginTexts();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [nonce, setNonce] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitTime, setSubmitTime] = useState(Date.now());
  const now = useNow();

  const { mutateAsync: emailLogin, isPending: emailLoginLoading } =
    useEmailLoginMutation();

  const isValidEmail = /^[\w+.-]+@[\w.-]+\.\w+$/.test(email);
  const submitEmail = async () => {
    if (!email.trim()) {
      setFieldError(t('common:errors.field-required'));
      return;
    }

    if (!isValidEmail) {
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

  const { mutateAsync: verifyEmail, isPending: verifyEmailLoading } =
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
      setNonce('');
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

  const [isConnecting, setIsConnecting] = useState(false);
  const [uuid] = useState(v4());
  const { mutateAsync: tgLoginFromWeb } = useMiniAppTgLoginFromWebMutation();
  const tgHandler = async () => {
    window.open(`${TELEGRAM_BOT_BASE_URL}?startapp=connect_${uuid}`, '_blank');

    setIsConnecting(true);
    for (let i = 0; i < 10; ++i) {
      if (
        await tgLoginFromWeb({
          uuid,
          referrer: localStorage.getItem(REFERRER_CODE_KEY) ?? undefined,
        })
      ) {
        setIsConnecting(false);
        onResolve?.(true);
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    setIsConnecting(false);
  };
  const notice = (
    <p className="text-2xs text-v1-content-secondary [&_a]:text-v1-content-brand">
      <Trans i18nKey="login.notice" ns="auth">
        By continuing, you agree to our
        <a
          className="underline"
          href={`${DOCS_ORIGIN}/privacy-policy`}
          rel="noreferrer"
          target="_blank"
        >
          Privacy Policy
        </a>
        and
        <a
          className="underline"
          href={`${DOCS_ORIGIN}/terms-and-conditions`}
          rel="noreferrer"
          target="_blank"
        >
          Terms of Service
        </a>
        .
      </Trans>
    </p>
  );

  const emailContent = (
    <>
      <h1 className="mb-3 pr-12 font-medium text-xl leading-normal max-md:hidden">
        {title}
      </h1>
      <p className="mb-6 text-sm text-v1-content-secondary leading-normal max-md:hidden">
        {subtitle}
      </p>

      <div className="flex flex-col items-stretch gap-4">
        <TextBox
          error={fieldError}
          label={
            <div className="flex w-full items-center justify-between">
              <span>{t('login.step-1.field-email')}</span>
              <ReferralCode />
            </div>
          }
          onChange={x => {
            setEmail(x);
            setNonce('');
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
          placeholder={t('login.step-1.field-email-placeholder')}
          type="email"
          value={email}
        />
        <Button
          loading={emailLoginLoading}
          onClick={submitEmail}
          size="md"
          variant="primary"
        >
          {t('login.step-1.button-submit-email')}
        </Button>
      </div>

      <div className="my-6 flex h-px w-full items-center justify-center overflow-visible bg-v1-border-disabled">
        <span className="px-2 text-v1-content-secondary text-xs backdrop-blur-lg">
          {t('common:or')}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-md w-full max-w-[320px] overflow-hidden rounded-lg bg-white text-center">
          <GoogleLogin
            logo_alignment="center"
            onSuccess={googleHandler}
            size="large"
            text="continue_with"
            theme="outline"
            type="standard"
            use_fedcm_for_prompt
            width={320}
          />
        </div>

        <TelegramLogin className="max-w-[320px]" onClick={tgHandler} />
        {notice}
      </div>
    </>
  );

  const codeContent = (
    <>
      <h1 className="mb-5 pr-12 font-medium text-xl leading-normal max-md:hidden">
        {t('login.step-2.title')}
      </h1>
      <p className="mb-9 text-v1-content-secondary text-xs leading-normal max-md:mb-4">
        {t('login.step-2.subtitle', { email })}
      </p>

      <div className="flex flex-col items-stretch">
        <div className="mb-3 text-xs">{t('login.step-2.field-nonce')}</div>
        <VerificationInput
          autoFocus
          classNames={{
            character: clsx(
              'rounded-lg !border-transparent !bg-v1-surface-l3 !text-white',
            ),
            characterSelected: clsx(
              'border !outline-v1-border-brand outline-none',
            ),
            container: clsx('!w-full gap-4'),
          }}
          onChange={setNonce}
          placeholder=" "
          validChars="0-9"
          value={nonce}
        />
        {fieldError && (
          <div className="mt-3 ml-1 text-v1-content-negative">{fieldError}</div>
        )}
        <Button
          className="mt-4"
          loading={verifyEmailLoading}
          onClick={submitCode}
          variant="primary"
        >
          {t('login.step-2.btn-submit-otp')}
        </Button>
        <div className="mx-1 mt-3 flex items-center justify-between gap-2 text-xs">
          <Button
            className="!px-0"
            onClick={() => setStep('email')}
            size="xs"
            variant="link"
          >
            {t('login.step-2.btn-change-email')}
          </Button>
          <Button
            disabled={remTime > 0}
            loading={emailLoginLoading}
            onClick={submitEmail}
            size="xs"
            variant="ghost"
          >
            {remTime > 0 ? (
              <div className="font-mono">
                {remMinutes.toString().padStart(2, '0')}:
                {remSeconds.toString().padStart(2, '0')}
              </div>
            ) : (
              t('login.step-2.btn-resend')
            )}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative grid h-[31rem] max-h-svh w-full grid-cols-2 items-stretch justify-between overflow-hidden max-md:flex max-md:h-full max-md:flex-col-reverse">
      <div className="relative flex min-h-min grow flex-col items-stretch px-8 py-6 max-md:h-auto max-md:grow-0 max-md:justify-end">
        <Logo className="mb-6 h-10 w-auto self-start max-md:hidden" />
        {emailLoginLoading || verifyEmailLoading || isConnecting ? (
          <div className="my-8 flex grow flex-col items-center justify-center">
            <Spinner />
            {isConnecting && (
              <div className="flex justify-center">
                <Button
                  className="!pr-6 mt-4"
                  onClick={() => setIsConnecting(false)}
                  size="sm"
                  variant="primary"
                >
                  <Icon className="mr-2" name={bxArrowBack} size={16} />
                  {t('common:actions.cancel')}
                </Button>
              </div>
            )}
          </div>
        ) : step === 'email' ? (
          emailContent
        ) : (
          codeContent
        )}
      </div>
      <div className="!overflow-hidden relative w-full shrink grow max-md:rounded-b-3xl">
        <ModalLoginSlides className="size-full" />
      </div>
    </div>
  );
};

const ReferralCode = () => {
  const [referralCode, setReferralCode] = useState(
    localStorage.getItem(REFERRER_CODE_KEY) ?? undefined,
  );

  return (
    <div className="flex items-center gap-1">
      <span className="text-v1-content-secondary">Referral Code</span>
      <EditableText
        onChange={newValue => {
          if (!newValue) {
            localStorage.removeItem(REFERRER_CODE_KEY);
          } else {
            localStorage.setItem(REFERRER_CODE_KEY, newValue);
          }
          setReferralCode(newValue);
        }}
        value={referralCode}
      />
    </div>
  );
};

export const useModalLogin = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const forceLogin = searchParams.has('fl');
  const resolver = useRef<((result: boolean) => void) | undefined>(undefined);

  const handleClose = () => {
    resolver.current?.(false);
    setOpen(false);
  };

  const handleResolve = () => {
    resolver.current?.(true);
    setOpen(false);
  };

  const content = (
    <>
      <Dialog
        className="z-[2_147_483_647] w-[55rem] max-md:h-full max-md:max-h-full max-md:w-full max-md:max-w-full" // z-index: 1 unit higher than cookie-bot banner
        closable={!forceLogin}
        footer={false}
        modalConfig={{
          closeButton: !forceLogin,
        }}
        mode="modal"
        onClose={handleClose}
        open={open}
        surface={1}
      >
        <LoginModalContent onResolve={handleResolve} />
      </Dialog>
    </>
  );

  const lastPromise = useRef<Promise<boolean> | undefined>(undefined);
  const show = useCallback(() => {
    if (!open) {
      lastPromise.current = new Promise<boolean>(resolve => {
        resolver.current = resolve;
        setOpen(true);
      });
    }
    return lastPromise.current;
  }, [open]);

  return [content, show] as const;
};
