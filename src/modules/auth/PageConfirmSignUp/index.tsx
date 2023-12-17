import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useAccountQuery, useResendVerificationEmailMutation } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import Button from 'shared/Button';
import { login } from '../authHandlers';
import ContainerAuth from '../ContainerAuth';
import inboxImg from './email.svg';

const PageConfirmSignUp = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { data: account } = useAccountQuery();
  const [isChecking, setIsChecking] = useState(false);

  const checkAgain = () => {
    setIsChecking(true);
    login();
  };

  const [isResending, setIsResending] = useState(false);
  const resendVerify = useResendVerificationEmailMutation();
  const resendEmail = async () => {
    try {
      setIsResending(true);
      if (await resendVerify()) {
        notification.success({
          message: t('verify-email.notification-email-sent'),
        });
      }
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (account?.info.email_verified) {
      navigate('/auth/secondary-signup');
    }
  }, [account, navigate]);

  return (
    <ContainerAuth>
      <main className="mb-20 flex flex-col items-center justify-center">
        <img src={inboxImg} className="w-32 md:w-44" alt="inbox" />
        <p className="text-3xl text-white md:text-5xl">
          <Trans i18nKey="verify-email.title" ns="auth">
            Verify <b>Your Email</b>
          </Trans>
        </p>

        <p className="p-7 text-center text-sm leading-loose text-[#ffffffcc]">
          <Trans i18nKey="verify-email.link-sent" ns="auth">
            A link has been sent to your email
            <span className="text-[#ffffff]">
              {{ email: account?.info.email ?? '' }}
            </span>
            <br />
            To verify your account, please click on the link.
          </Trans>
        </p>

        <Button onClick={checkAgain} className="mb-4" variant="primary">
          {isChecking
            ? t('verify-email.btn-check.loading')
            : t('verify-email.btn-check.label')}
        </Button>

        <Button variant="secondary" onClick={resendEmail}>
          {isResending
            ? t('verify-email.btn-resend.loading')
            : t('verify-email.btn-resend.label')}
        </Button>
      </main>
    </ContainerAuth>
  );
};

export default PageConfirmSignUp;
