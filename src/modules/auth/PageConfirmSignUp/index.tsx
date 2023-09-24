import { notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResendVerificationEmailMutation, useUserInfoQuery } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import { login } from '../authHandlers';
import ContainerAuth from '../ContainerAuth';
import inboxImg from './email.svg';

const PageConfirmSignUp = () => {
  const navigate = useNavigate();
  const { data: userInfo } = useUserInfoQuery();
  const [isChecking, setIsChecking] = useState(false);

  const checkAgain = useCallback(() => {
    setIsChecking(true);
    login();
  }, []);

  const [isResending, setIsResending] = useState(false);
  const resendVerify = useResendVerificationEmailMutation();
  const resendEmail = useCallback(async () => {
    try {
      setIsResending(true);
      if (await resendVerify()) {
        notification.success({
          message: 'Verification Email Sent Successfully.',
        });
      }
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    } finally {
      setIsResending(false);
    }
  }, [resendVerify]);

  useEffect(() => {
    if (userInfo?.account.info.email_verified) {
      navigate('/auth/secondary-signup');
    }
  }, [userInfo, navigate]);

  return (
    <ContainerAuth>
      <main className="mb-20 flex flex-col items-center justify-center">
        <img src={inboxImg} className="w-32 md:w-44" alt="inbox" />
        <p className="text-3xl text-white md:text-5xl">
          Verify <b>Your Email</b>
        </p>

        <p className="p-7 text-center text-sm leading-loose text-[#ffffffcc]">
          A link has been sent to your email{' '}
          <span className="text-[#ffffff]">{userInfo?.user.email || ''}</span>
          <br />
          To verify your account, please click on the link.
        </p>

        <button
          onClick={checkAgain}
          className="mb-4 rounded-full border border-solid border-[#ffffff4d] px-9 py-3 text-base md:px-16 md:py-5 md:text-xl"
        >
          Check{isChecking ? 'ing...' : ''}
        </button>

        <button
          className="rounded-full border border-solid border-[#ffffff4d] px-9 py-3 text-base md:px-16 md:py-5 md:text-xl"
          onClick={resendEmail}
        >
          {isResending
            ? 'Resending Verification Email ...'
            : 'Resend Verification Email'}
        </button>
      </main>
    </ContainerAuth>
  );
};

export default PageConfirmSignUp;
