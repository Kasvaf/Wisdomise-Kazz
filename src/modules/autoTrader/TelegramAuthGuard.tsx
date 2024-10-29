import { type PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { useTelegram } from 'modules/autoTrader/TelegramProvider';
import { isLocal } from 'utils/version';
import loading from 'modules/autoTrader/loading.png';
import logo from 'assets/logo-horizontal.svg';
import { useMiniAppLoginQuery } from 'api/auth';
import spin from './spin.svg';
import bg from './bg.png';

export default function TelegramAuthGuard({ children }: PropsWithChildren) {
  const { webApp } = useTelegram();
  const query =
    'query_id=AAFRJrwCAAAAAFEmvALEYfE3&user=%7B%22id%22%3A45885009%2C%22first_name%22%3A%22Majid%22%2C%22last_name%22%3A%22Pouramini%22%2C%22username%22%3A%22MJD77%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1720890712&hash=c49cf126ac04720798595c89775f5ce632c5724029427fbb2d90cc9a3c45e86d';

  const { data: isLoggedIn } = useMiniAppLoginQuery(
    isLocal ? query : webApp?.initData,
  );
  const navigate = useNavigate();
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !navigated) {
      navigate('/onboarding');
      setNavigated(true);
      Sentry.setUser({
        id: String(webApp?.initDataUnsafe.user?.id),
        username: webApp?.initDataUnsafe.user?.username,
      });
    }
  }, [isLoggedIn, webApp?.initDataUnsafe.user, navigate, navigated]);

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
