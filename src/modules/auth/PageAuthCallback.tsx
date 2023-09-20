import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppsInfoQuery } from 'api';
import { DOMAIN } from 'config/constants';
import Splash from 'modules/base/Splash';
import { JWT_TOKEN_KEY, AFTER_LOGIN_KEY, REDIRECT_APP_KEY } from './constants';
import getJwtToken from './getJwtToken';

export const TOKEN_PARAM = 'token';

function replaceLocation(url: string) {
  sessionStorage.removeItem(AFTER_LOGIN_KEY);
  sessionStorage.removeItem(REDIRECT_APP_KEY);
  window.location.replace(url);
}

export default function PageAuthCallback() {
  const navigate = useNavigate();
  const appsInfo = useAppsInfoQuery();
  const apps = appsInfo.data?.results;
  const [searchParams] = useSearchParams();

  const handleAppRedirect = useCallback(
    (appName: string) => {
      if (!apps?.length) return;

      const token = getJwtToken();
      const redirectUrl = apps
        .find(x => x.name === appName)
        ?.frontend_url.replace('DOMAIN', DOMAIN);

      if (redirectUrl && token) {
        const appCallbackUrl = `${redirectUrl}/auth/callback?token=${token}`;
        replaceLocation(appCallbackUrl);
        return true;
      }
    },
    [apps],
  );

  useEffect(() => {
    if (appsInfo.isLoading) return;

    const tokenParam = searchParams.get(TOKEN_PARAM);
    if (tokenParam) {
      localStorage.setItem(JWT_TOKEN_KEY, JSON.stringify(tokenParam));
    }

    const appName = sessionStorage.getItem(REDIRECT_APP_KEY);
    const route = sessionStorage.getItem(AFTER_LOGIN_KEY);

    if (appName && handleAppRedirect(appName)) {
      // nothing, logic already called
    } else if (route) {
      // or appName was not found
      replaceLocation(route);
    } else {
      navigate('/');
    }
  }, [appsInfo, searchParams, navigate, handleAppRedirect]);

  return <Splash />;
}
