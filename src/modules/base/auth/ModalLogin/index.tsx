/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VerificationInput from 'react-verification-input';
import { GoogleLogin } from '@react-oauth/google';
import { Modal as AntModal } from 'antd';
import { bxArrowBack, bxX } from 'boxicons-quasar';
import { v4 } from 'uuid';
import {
  useEmailLoginMutation,
  useGoogleLoginMutation,
  useMiniAppTgLoginFromWebMutation,
  useVerifyEmailMutation,
} from 'api/auth';
import useNow from 'utils/useNow';
import Spinner from 'shared/Spinner';
import TextBox from 'shared/TextBox';
import { REFERRER_CODE_KEY } from 'modules/account/PageRef';
import Icon from 'shared/Icon';
import { AUTO_TRADER_MINI_APP_BASE } from 'config/constants';
import useIsMobile from 'utils/useIsMobile';
import { Button } from 'shared/v1-components/Button';
import TelegramLogin from './TelegramLogin';
import { useModalLoginTexts } from './useModalLoginTexts';
import { ReactComponent as Logo } from './logo.svg';
import { ModalLoginSlides } from './ModalLoginSlides';

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

  const { mutateAsync: emailLogin, isLoading: emailLoginLoading } =
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

  const [isConnecting, setIsConnecting] = useState(false);
  const [uuid] = useState(v4());
  const { mutateAsync: tgLoginFromWeb } = useMiniAppTgLoginFromWebMutation();
  const tgHandler = async () => {
    window.open(
      AUTO_TRADER_MINI_APP_BASE + '?startapp=connect_' + uuid,
      '_blank',
    );

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

  const emailContent = (
    <>
      <h1 className="mb-4 pr-12 text-xl font-medium leading-normal mobile:hidden">
        {title}
      </h1>
      <p className="mb-6 text-xs leading-normal text-v1-content-secondary mobile:hidden">
        {subtitle}
      </p>

      <div className="flex flex-col items-stretch gap-4">
        <TextBox
          label={t('login.step-1.field-email')}
          value={email}
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
          error={fieldError}
        />
        <Button
          variant="primary"
          onClick={submitEmail}
          loading={emailLoginLoading}
        >
          {t('login.step-1.button-submit-email')}
        </Button>
      </div>

      <div className="my-6 flex h-px w-full items-center justify-center overflow-visible bg-v1-border-disabled">
        <span className="px-2 text-xs text-v1-content-secondary backdrop-blur-lg">
          {t('common:or')}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-md w-full max-w-[320px] overflow-hidden rounded-lg bg-white text-center">
          <GoogleLogin
            onSuccess={googleHandler}
            use_fedcm_for_prompt
            text="continue_with"
            size="large"
            theme="outline"
            type="standard"
            logo_alignment="center"
            width={320}
          />
        </div>

        <TelegramLogin className="max-w-[320px]" onClick={tgHandler} />
      </div>
    </>
  );

  const codeContent = (
    <>
      <h1 className="mb-5 pr-12 text-xl font-medium leading-normal mobile:hidden">
        {t('login.step-2.title')}
      </h1>
      <p className="mb-9 text-xs leading-normal text-v1-content-secondary mobile:mb-4">
        {t('login.step-2.subtitle', { email })}
      </p>

      <div className="flex flex-col items-stretch">
        <div className="mb-3 text-xs">{t('login.step-2.field-nonce')}</div>
        <VerificationInput
          autoFocus
          validChars="0-9"
          placeholder=" "
          classNames={{
            character: clsx(
              'rounded-lg border-transparent bg-v1-surface-l3 text-white',
            ),
            characterSelected: clsx('border border-white outline-none'),
            container: clsx('w-full gap-4'),
          }}
          value={nonce}
          onChange={setNonce}
        />
        {fieldError && <div className="ml-1 mt-3 text-error">{fieldError}</div>}
        <Button
          variant="primary"
          onClick={submitCode}
          loading={verifyEmailLoading}
          className="mt-4"
        >
          {t('login.step-2.btn-submit-otp')}
        </Button>
        <div className="mx-1 mt-3 flex items-center justify-between gap-2 text-xs">
          <Button
            variant="link"
            size="xs"
            onClick={() => setStep('email')}
            className="!px-0"
          >
            {t('login.step-2.btn-change-email')}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            disabled={remTime > 0}
            onClick={submitEmail}
            loading={emailLoginLoading}
          >
            {remTime > 0 ? (
              <div className="font-mono">
                {remMinutes.toString().padStart(2, '0')}:
                {remSeconds.toString().padStart(2, '0')}
              </div>
            ) : (
              <>{t('login.step-2.btn-resend')}</>
            )}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative grid h-[590px] max-h-svh w-full grid-cols-2 items-stretch justify-between overflow-hidden mobile:flex mobile:h-full mobile:flex-col-reverse">
      <div className="absolute left-8 top-8 mobile:hidden">
        <Logo />
      </div>
      <div className="relative flex min-h-[275px] grow flex-col items-stretch justify-center p-8 mobile:h-auto mobile:grow-0 mobile:justify-end">
        {emailLoginLoading || verifyEmailLoading || isConnecting ? (
          <div className="my-8 flex grow flex-col items-center justify-center">
            <Spinner />
            {isConnecting && (
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4 !pr-6"
                  onClick={() => setIsConnecting(false)}
                >
                  <Icon name={bxArrowBack} size={16} className="mr-2" />
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
      <div className="relative w-full shrink grow !overflow-hidden mobile:rounded-b-3xl">
        <ModalLoginSlides className="size-full" />
      </div>
    </div>
  );
};

export const useModalLogin = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
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
      <AntModal
        centered
        open={open}
        onCancel={handleClose}
        destroyOnClose
        footer={false}
        closable
        maskClosable={false}
        closeIcon={isMobile ? <></> : <Icon name={bxX} size={16} />}
        width={950}
        className="max-h-full max-w-full mobile:h-full mobile:w-full [&_.ant-modal-body]:size-full [&_.ant-modal-content]:!bg-v1-surface-l1 [&_.ant-modal-content]:p-0 mobile:[&_.ant-modal-content]:h-full mobile:[&_.ant-modal-content]:w-full [&_.ant-modal-content]:mobile:!rounded-none"
      >
        <LoginModalContent onResolve={handleResolve} />
      </AntModal>
    </>
  );

  const show = () =>
    new Promise<boolean>(resolve => {
      if (!open) {
        resolver.current = resolve;
        setOpen(true);
      }
      throw new Error('Login modal is already open!');
    });

  return [content, show] as const;
};
