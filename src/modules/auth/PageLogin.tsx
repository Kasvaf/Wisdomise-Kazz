import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Splash from 'modules/base/Splash';
import { login } from './authHandlers';
import {
  AFTER_LOGIN_KEY,
  REDIRECT_APP_KEY,
  REMOTE_LOGIN_KEY,
} from './constants';

export const APP_PARAM = 'app';
export const isLocalRe = /^http:\/\/([\w-]+\.)*localhost(:\d+)?$/;

export default function PageLogin() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const appParam = searchParams.get(APP_PARAM);
    if (appParam) {
      sessionStorage.setItem(REDIRECT_APP_KEY, appParam);
    }

    const afterLogin = searchParams.get(AFTER_LOGIN_KEY);
    if (afterLogin) {
      sessionStorage.setItem(AFTER_LOGIN_KEY, afterLogin);
    }

    const remLogin = searchParams.get(REMOTE_LOGIN_KEY);
    if (remLogin && isLocalRe.test(remLogin)) {
      sessionStorage.setItem(REMOTE_LOGIN_KEY, remLogin);
    }

    login(searchParams.toString());
  }, [searchParams]);

  return <Splash />;
}
