import * as Sentry from '@sentry/react';
import { type PropsWithChildren, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useMiniAppConnectMutation,
  useMiniAppTgLoginMutation,
  useMiniAppWebLoginMutation,
} from 'services/rest/auth';
import useConfirm from 'shared/useConfirm';
import useStartParams from '../../autoTrader/useStartParams';
import Splash from '../Splash';
import { useTelegram } from './TelegramProvider';

export default function TelegramAuthGuard({ children }: PropsWithChildren) {
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
    { closable: false, maskClosable: false },
  );

  const [spType] = useStartParams();
  useEffect(() => {
    if (!webApp) return;

    void (async () => {
      if (spType === 'login') {
        // open mini-app, by web-user
        if ((await doWebLogin({})) === 'exists') {
          if (await confirm()) {
            await doWebLogin({ confirm: true });
          } else {
            webApp.close();
          }
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
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
    <div>
      <Splash />
      {ModalConfirm}
    </div>
  );
}
