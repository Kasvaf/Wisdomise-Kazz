import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { isLocal } from 'utils/version';
import { login } from '../authHandlers';
import { AFTER_LOGIN_KEY, REDIRECT_APP_KEY } from '../constants';
import TokenSetter from './TokenSetter';

export const APP_PARAM = 'app';

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

    if (!isLocal) {
      login(searchParams.toString());
    }
  }, [searchParams]);

  return isLocal ? <TokenSetter /> : null;
}
