import { type PropsWithChildren, useEffect, useMemo } from 'react';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useMiniAppConnectMutation,
  useMiniAppTgLoginMutation,
  useMiniAppWebLoginMutation,
} from 'api/auth';
import logo from 'assets/logo-horizontal.svg';
import { useDebugMode } from 'shared/useDebugMode';
import useConfirm from 'shared/useConfirm';
import useStartParams from '../useStartParams';
import { useTelegram } from './TelegramProvider';
import loading from './loading.png';
import spin from './spin.svg';
import bg from './bg.png';

export default function TelegramAuthGuard({ children }: PropsWithChildren) {
  useDebugMode();
  const { webApp } = useTelegram();

  const { mutateAsync: doConnect } = useMiniAppConnectMutation();
  const { data: tgLogin, mutateAsync: doTgLogin } = useMiniAppTgLoginMutation();
  const { data: webLogin, mutateAsync: doWebLogin } =
    useMiniAppWebLoginMutation();
  const isLoggedIn = tgLogin === true || webLogin === true;

  const { t } = useTranslation();
  const [ModalConfirm, confirm] = useConfirm(
    useMemo(
      () => ({
        title: 'You already have an account on the mini-app.',
        yesTitle: t('common:actions.yes'),
        noTitle: t('common:actions.no'),
        message: (
          <>
            <p>
              If you continue, your mini-app account will be{' '}
              <strong>permanently deleted</strong> and replaced with your web
              account. All data from your mobile account will be lost forever.{' '}
            </p>
            <p>Do you want to proceed?</p>
          </>
        ),
      }),
      [t],
    ),
  );

  const [spType] = useStartParams();
  useEffect(() => {
    if (!webApp) return;

    void (async function () {
      if (spType === 'login') {
        // open mini-app, by web-user
        if ((await doWebLogin({})) === 'exists' && (await confirm())) {
          await doWebLogin({ confirm: true });
        }
      } else {
        // login to web by telegram (asks for connection)
        await doTgLogin({});
        if (spType === 'connect') {
          await doConnect({});
          webApp.close();
        }
      }
    })();
  }, [spType, confirm, doTgLogin, doWebLogin, doConnect, webApp]);

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      Sentry.setUser({
        id: String(webApp?.initDataUnsafe.user?.id),
        username: webApp?.initDataUnsafe.user?.username,
      });
    }
  }, [isLoggedIn, webApp?.initDataUnsafe.user, navigate]);

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
      {ModalConfirm}
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
