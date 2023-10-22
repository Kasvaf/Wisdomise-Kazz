import {
  useEffect,
  type PropsWithChildren,
  useState,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AFTER_LOGIN_KEY,
  REDIRECT_APP_KEY,
  REMOTE_LOGIN_KEY,
} from 'modules/auth/constants';
import { useAccountQuery, useAppsInfoQuery } from 'api';
import Splash from 'modules/base/Splash';
import { DOMAIN } from 'config/constants';
import getJwtToken from './getJwtToken';

function replaceLocation(url: string) {
  sessionStorage.removeItem(AFTER_LOGIN_KEY);
  sessionStorage.removeItem(REDIRECT_APP_KEY);
  sessionStorage.removeItem(REMOTE_LOGIN_KEY);
  window.location.replace(decodeURIComponent(url));
}

export default function AuthGuard({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { data: account } = useAccountQuery();

  const appsInfo = useAppsInfoQuery();
  const apps = appsInfo.data?.results;

  const redirectLogin = useCallback((redirectUrl: string) => {
    const token = getJwtToken();
    if (token) {
      replaceLocation(`${redirectUrl}/auth/callback?token=${token}`);
      return true;
    }
  }, []);

  const handleAppRedirect = useCallback(
    (appName: string) => {
      if (!apps?.length) return;

      const redirectUrl = apps
        .find(x => x.name === appName)
        ?.frontend_url.replace('DOMAIN', DOMAIN);

      if (redirectUrl) {
        return redirectLogin(redirectUrl);
      }
    },
    [apps, redirectLogin],
  );

  useEffect(() => {
    if (!account || !loading) return;
    if (!account.info.email_verified) {
      navigate('/auth/verify-email');
    } else if (account.register_status === 'PRIMARY') {
      navigate('/auth/secondary-signup');
    } else if (!appsInfo.isLoading) {
      const appName = sessionStorage.getItem(REDIRECT_APP_KEY);
      const route = sessionStorage.getItem(AFTER_LOGIN_KEY);
      const remoteLogin = sessionStorage.getItem(REMOTE_LOGIN_KEY);

      if (appName && handleAppRedirect(appName)) {
        // nothing, logic already called
      } else if (route) {
        // or appName was not found
        replaceLocation(route);
      } else if (remoteLogin) {
        redirectLogin(remoteLogin);
      } else {
        setLoading(false);
      }
    }
  }, [loading, account, appsInfo, navigate, handleAppRedirect, redirectLogin]);

  return loading ? <Splash /> : <>{children}</>;
}
