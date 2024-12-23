import { type PropsWithChildren, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { isLocal } from 'utils/version';
import { useMiniAppLoginQuery } from 'api/auth';
import logo from 'assets/logo-horizontal.svg';
import { useTelegram } from './TelegramProvider';
import loading from './loading.png';
import spin from './spin.svg';
import bg from './bg.png';

export default function TelegramAuthGuard({ children }: PropsWithChildren) {
  const { webApp } = useTelegram();
  const query = import.meta.env.VITE_CUSTOM_QUERY;

  const { data: isLoggedIn } = useMiniAppLoginQuery(
    isLocal ? query : webApp?.initData,
  );
  const navigate = useNavigate();
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !navigated) {
      if (!localStorage.getItem('done_onboarding')) {
        navigate('/onboarding');
        setNavigated(true);
      }
      Sentry.setUser({
        id: String(webApp?.initDataUnsafe.user?.id),
        username: webApp?.initDataUnsafe.user?.username,
      });
    }
  }, [isLoggedIn, webApp?.initDataUnsafe.user, navigated, navigate]);

  return isLoggedIn ? (
    <div>{children}</div>
  ) : (
    <div className="relative overflow-hidden">
      <Background />
      <div className="relative flex h-screen flex-col p-6 pb-10 text-center">
        <img src={logo} className="mt-4 h-10" />
        <img src={loading} className="w-full" />
        <h1 className="text-lg font-semibold">Wisdomise Auto Trader</h1>
        <p className="mt-4">
          Welcome to Wisdomise Autotrader, where you can automate your trades
          with AI-driven insights, set precise limit orders, and stay ahead with
          real-time market updates.
          <br />
          Join the waitlist now for early access!
        </p>
        <div className="mt-auto flex flex-col items-center">
          <img src={spin} className="animate-spin" />
          <div className="mt-4">Loading...</div>
        </div>
      </div>
    </div>
  );
}

export function Background() {
  return (
    <>
      <div
        style={{
          background:
            'radial-gradient(132.96% 132.96% at 48.76% -45.34%, #FFF 0%, #9747FF 25.85%, #00A3FF 100%)',
        }}
        className="absolute -end-20 -start-20 bottom-0 h-[50vh] blur-3xl"
      ></div>
      <img
        src={bg}
        className="absolute bottom-0 h-screen w-screen opacity-20 bg-blend-soft-light"
      />
    </>
  );
}
