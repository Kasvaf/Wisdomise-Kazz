import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { bxErrorCircle } from 'boxicons-quasar';
import { useAccountQuery, useResendVerificationEmailMutation } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import ContainerAuth from '../ContainerAuth';
import { login } from '../authHandlers';
import inboxImg from './email.svg';

const PageConfirmSignUp = () => {
  const [params] = useSearchParams();
  const { t } = useTranslation('auth');
  const successParam = params.get('success');
  const account = useAccountQuery();
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
    if (successParam === 'true') {
      login();
    }
  }, [successParam]);

  if (successParam === 'true' || account.isLoading) return null;

  if (account.data?.info.email_verified) {
    return <Navigate to="/auth/secondary-signup" />;
  }

  return (
    <ContainerAuth>
      <main className="mb-20 flex flex-col items-center justify-center">
        {successParam === 'false' && (
          <>
            <Icon name={bxErrorCircle} size={120} className="text-red-700" />
            <p className="mb-4 text-xl font-semibold capitalize text-red-700">
              {t('verify-email.error-title')}
            </p>

            <p className="mb-8 text-2xl capitalize">
              {t('verify-email.error')}
            </p>
          </>
        )}

        {!successParam && (
          <>
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
                  {{ email: account.data?.info.email ?? '' }}
                </span>
                <br />
                To verify your account, please click on the link.
              </Trans>
            </p>
          </>
        )}

        {(!successParam || successParam === 'false') && (
          <Button variant="primary" onClick={resendEmail}>
            {isResending
              ? t('verify-email.btn-resend.loading')
              : t('verify-email.btn-resend.label')}
          </Button>
        )}
      </main>
    </ContainerAuth>
  );
};

export default PageConfirmSignUp;
