import { notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useResendVerificationEmailMutation, useUserInfoQuery } from 'api';
import { JwtTokenKey, LoginUrl } from 'config/constants';
import AuthPageContainer from '../AuthPageContainer';
import inboxImg from './email.svg';

const ConfirmSignUp = () => {
  const { data: userInfo } = useUserInfoQuery();
  const [isChecking, setIsChecking] = useState(false);
  const resendVerify = useResendVerificationEmailMutation();

  const checkAgain = useCallback(() => {
    setIsChecking(true);
    localStorage.removeItem(JwtTokenKey);
    window.location.assign(LoginUrl);
  }, []);

  useEffect(() => {
    if (resendVerify.status === 'success') {
      notification.success({
        message: 'Verification Email Sent Successfully.',
      });
    }
  }, [resendVerify]);

  return (
    <AuthPageContainer>
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
          onClick={useCallback(() => resendVerify.mutate(), [resendVerify])}
        >
          {resendVerify.isLoading
            ? 'Resending Verification Email ...'
            : 'Resend Verification Email'}
        </button>
      </main>
    </AuthPageContainer>
  );
};

export default ConfirmSignUp;
