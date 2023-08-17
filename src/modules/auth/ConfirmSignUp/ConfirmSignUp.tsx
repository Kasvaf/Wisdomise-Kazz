import Logo from '@images/wisdomiseWealthLogo.svg';
import { notification } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useResendVerificationEmailMutation, useUserInfoQuery } from 'api';
import { JwtTokenKey } from 'config/constants';
import { DB } from 'config/keys';
import { logout } from 'utils/auth';
import bgMobile from './bg-mobile.png';
import bgDesktop from './bg.png';
import inboxImg from './email.svg';

const ConfirmSignUp = () => {
  const { data: userInfo } = useUserInfoQuery();
  const [isChecking, setIsChecking] = useState(false);
  const resendVerify = useResendVerificationEmailMutation();

  const checkAgain = () => {
    setIsChecking(true);
    localStorage.removeItem(JwtTokenKey);
    window.location.assign(`${DB}/api/v1/account/login`);
  };

  useEffect(() => {
    if (resendVerify.status === 'success') {
      notification.success({
        message: 'Verification Email Sent Successfully.',
      });
    }
  }, [resendVerify]);

  return (
    <div
      style={
        {
          '--bg-mobile': `url('${bgMobile}')`,
          '--bg-desktop': `url('${bgDesktop}')`,
        } as React.CSSProperties
      }
      className="min-h-screen w-full bg-[image:var(--bg-mobile)] bg-cover bg-no-repeat text-white md:bg-[image:var(--bg-desktop)]"
    >
      <div className="m-auto flex min-h-screen max-w-[1300px] flex-col justify-between">
        <div>
          <header className="mb-10 mt-8 flex items-center justify-between px-8">
            <div className="w-44">
              <img src={Logo} alt="wisdomise_wealth_logo" />
            </div>

            <button
              onClick={logout}
              className="md:text-x rounded-full border border-solid border-[#ffffff4d] px-5 py-3 text-xs md:px-8 md:py-3"
            >
              Log Out
            </button>
          </header>

          <main className="mb-20 flex flex-col items-center justify-center">
            <img src={inboxImg} className="w-32 md:w-44" alt="inbox" />
            <p className="text-3xl text-white md:text-5xl">
              Verify <b>Your Email</b>
            </p>

            <p className="p-7 text-center text-sm leading-loose text-[#ffffffcc]">
              A link has been sent to your email{' '}
              <span className="text-[#ffffff]">
                {userInfo?.customer.user.email || ''}
              </span>
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
              onClick={() => resendVerify.mutate()}
            >
              {resendVerify.isLoading
                ? 'Resending Verification Email ...'
                : 'Resend Verification Email'}
            </button>
          </main>
        </div>

        <footer className="pb-4 text-center text-xs text-[#ffffffcc] ">
          Version alpha 1.0.0 © 2023 Wisdomise. All rights reserved
        </footer>
      </div>
    </div>
  );
};

export default ConfirmSignUp;
