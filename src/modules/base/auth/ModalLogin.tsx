import { clsx } from 'clsx';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import VerificationInput from 'react-verification-input';
import { GoogleLogin } from '@react-oauth/google';
import { Divider } from 'antd';
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
import LoginBg from './login-bg.png';
import { ReactComponent as TrustIcon } from './trust.svg';
import { ReactComponent as SecureIcon } from './secure.svg';
import { ReactComponent as AnalyzeIcon } from './analyze.svg';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as AiIcon } from './ai.svg';

const ModalLogin: React.FC<{
  onResolve?: (success: boolean) => void;
  theme?: 'google' | 'default';
}> = ({ onResolve, theme = 'default' }) => {
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

  const notice = (
    <p className="my-5 text-xs text-white/70">
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

  const features: Array<{ icon: typeof TrustIcon; text: string }> = [
    {
      icon: TrustIcon,
      text: t('login.features.trusted'),
    },
    {
      icon: AnalyzeIcon,
      text: t('login.features.analyzed'),
    },
    {
      icon: AiIcon,
      text: t('login.features.ai_driven'),
    },
    {
      icon: SecureIcon,
      text: t('login.features.secure'),
    },
  ];

  const emailContent = (
    <div className="flex grow flex-col p-8 mobile:p-4">
      <h1 className="mb-4 text-xl font-medium">
        {theme === 'default'
          ? t('login.step-1.title')
          : t('login.step-1.title2')}
      </h1>
      <p className="mb-6 text-xs text-white/70">
        {theme === 'default'
          ? t('login.step-1.subtitle')
          : t('login.step-1.subtitle2')}
      </p>

      {theme !== 'default' && (
        <div className="mb-12 grid grid-cols-2 gap-4">
          {features.map(({ icon: FeatIcon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-xs font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-wsdm-gradient">
                <FeatIcon />
              </div>
              {text}
            </div>
          ))}
        </div>
      )}

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
          variant="primary-purple"
          onClick={submitEmail}
          loading={emailLoginLoading}
          disabled={!isValidEmail}
        >
          {t('login.step-1.button-submit-email')}
        </Button>
      </div>

      <Divider className="!my-6">{t('common:or')}</Divider>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={googleHandler}
          use_fedcm_for_prompt
          text="continue_with"
          size="large"
          theme="filled_blue"
          logo_alignment="center"
        />
      </div>

      <div className="min-h-10 grow" />

      {notice}
    </div>
  );

  const codeContent = (
    <div className="flex grow flex-col p-8">
      <h1 className="mb-5 text-xl font-medium">{t('login.step-2.title')}</h1>
      <p className="mb-9 text-xs text-white/70">
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
        <Button
          variant="primary-purple"
          onClick={submitCode}
          loading={verifyEmailLoading}
          disabled={nonce.length < 6}
          className="mt-4"
        >
          {t('base:user.sign-in')}
        </Button>
        <div className="mx-1 mt-3 flex justify-between gap-2 text-xs">
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

      <div
        className="my-7 cursor-pointer text-v1-content-link hover:text-v1-content-link-hover"
        onClick={() => setStep('email')}
      >
        {t('login.step-2.btn-change-email')}
      </div>

      <div className="min-h-10 grow" />

      {notice}
    </div>
  );

  return (
    <div className="flex min-h-[524px] w-full bg-v1-surface-l1">
      {emailLoginLoading || verifyEmailLoading ? (
        <div className="my-8 flex grow flex-col items-center justify-center">
          <Spinner />
        </div>
      ) : step === 'email' ? (
        emailContent
      ) : (
        codeContent
      )}
      {theme === 'default' && (
        <img
          src={LoginBg}
          className="h-[524px] w-[440px] shrink-0 bg-black/30 object-contain mobile:hidden"
        />
      )}
    </div>
  );
};

export const useModalLogin = (cancelable = true) => {
  const [Modal, showModal] = useModal(ModalLogin, {
    width: cancelable ? 880 : 499,
    closable: cancelable,
    maskClosable: cancelable,
    keyboard: false,
    className: '[&_.ant-modal-content]:!p-0',
  });
  return [
    Modal,
    async () =>
      !!(await showModal({
        theme: cancelable ? 'default' : 'google',
      })),
  ] as const;
};
