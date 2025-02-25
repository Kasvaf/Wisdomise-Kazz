import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import VerificationInput from 'react-verification-input';
import { GoogleLogin } from '@react-oauth/google';
import { Drawer as AntDrawer, Modal as AntModal } from 'antd';
import { bxArrowBack, bxCheck, bxX } from 'boxicons-quasar';
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
import Link from 'shared/Link';
import { REFERRER_CODE_KEY } from 'modules/account/PageRef';
import Icon from 'shared/Icon';
import { AUTO_TRADER_MINI_APP_BASE } from 'config/constants';
import useIsMobile from 'utils/useIsMobile';
import { Button } from 'shared/v1-components/Button';
// eslint-disable-next-line import/max-dependencies
import TelegramLogin from './TelegramLogin';

const LoginModalContent: React.FC<{
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

  const notice = (
    <p className="mt-5 text-xs text-v1-content-secondary [&_a]:text-v1-content-secondary [&_a]:underline">
      <Trans ns="auth" i18nKey="login.notice">
        By continuing, you agree to our
        <Link target="_blank" href="https://help.wisdomise.com/privacy-policy">
          Privacy Policy
        </Link>
        and
        <Link
          target="_blank"
          href="https://help.wisdomise.com/terms-and-conditions"
        >
          Terms of Service
        </Link>
        .
      </Trans>
    </p>
  );

  const features: string[] = [
    t('login.features.trusted'),
    t('login.features.analyzed'),
    t('login.features.ai_driven'),
    t('login.features.secure'),
  ];

  const emailContent = (
    <div className="flex grow flex-col p-8 mobile:p-4">
      <h1 className="mb-4 pr-12 text-xl font-medium">
        {t('login.step-1.title2')}
      </h1>
      <p className="mb-6 text-xs text-white/70">
        {t('login.step-1.subtitle2')}
      </p>

      <div className="mb-12 flex flex-col gap-4">
        {features.map(text => (
          <div
            key={text}
            className="flex items-center gap-2 text-xs font-normal"
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-wsdm-gradient">
              <Icon name={bxCheck} size={16} />
            </div>
            {text}
          </div>
        ))}
      </div>

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

      <div className="mb-6 flex flex-col items-center justify-center gap-4">
        <GoogleLogin
          onSuccess={googleHandler}
          use_fedcm_for_prompt
          text="continue_with"
          size="large"
          theme="filled_blue"
          logo_alignment="center"
        />

        <TelegramLogin onClick={tgHandler} />
      </div>

      {notice}
    </div>
  );

  const codeContent = (
    <div className="flex grow flex-col p-8">
      <h1 className="mb-5 pr-12 text-xl font-medium">
        {t('login.step-2.title')}
      </h1>
      <p className="mb-9 text-xs text-white/70">
        {t('login.step-2.subtitle', { email })}
      </p>

      <div className="mb-10 flex flex-col items-stretch">
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

      {notice}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-v1-surface-l2 p-4">
      <div className="absolute -top-48 left-1/2 mx-auto size-56 -translate-x-1/2 bg-white/55 blur-[110px]" />
      {emailLoginLoading || verifyEmailLoading || isConnecting ? (
        <div className="my-8 flex grow flex-col items-center justify-center">
          <div className="grow" />
          <Spinner />
          <div className="grow" />

          {isConnecting && (
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="sm"
                className="!pr-6"
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
      {isMobile ? (
        <AntDrawer
          placement="bottom"
          open={open}
          onClose={handleClose}
          destroyOnClose
          height="auto"
          style={{
            maxHeight: '90vh',
          }}
          closable
          closeIcon={<Icon name={bxX} />}
          className="rounded-t-2xl [&_.ant-drawer-body]:p-0 [&_.ant-drawer-header]:absolute [&_.ant-drawer-header]:z-10 [&_.ant-drawer-header]:w-full [&_.ant-drawer-header]:p-4"
          maskClosable={false}
        >
          <LoginModalContent onResolve={handleResolve} />
        </AntDrawer>
      ) : (
        <AntModal
          centered
          open={open}
          onCancel={handleClose}
          destroyOnClose
          footer={false}
          closable
          maskClosable={false}
          closeIcon={<Icon name={bxX} size={16} />}
          className="[&_.ant-modal-content]:p-0"
        >
          <LoginModalContent onResolve={handleResolve} />
        </AntModal>
      )}
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
