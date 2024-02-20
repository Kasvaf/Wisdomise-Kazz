import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Splash from 'modules/base/Splash';
import { DOMAIN } from 'config/constants';
import { setJwtToken } from './jwt-store';
import { AFTER_LOGIN_KEY } from './constants';

export default function PageAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const replaceLocation = (url: string) =>
    window.location.replace(decodeURIComponent(url));

  useEffect(() => {
    const token = searchParams.get('token');
    const afterLogin = searchParams.get(AFTER_LOGIN_KEY);
    setJwtToken(token || '');

    if (afterLogin) {
      // afterLogin can be pathname or a full url
      // if full -> redirect to that url (for dev login or sso login)
      // if pathname -> navigate to that inside app
      const afterLoginUrl = new URL(afterLogin, window.location.origin);
      const isRedirectToOtherOrigin =
        afterLoginUrl.origin !== window.location.origin;

      if (isRedirectToOtherOrigin) {
        const isForDevLogin =
          window.location.hostname === `stage-app.${DOMAIN}` &&
          afterLoginUrl.hostname === 'localhost';

        if (isForDevLogin) {
          replaceLocation(afterLogin + '/auth/callback?token=' + (token || ''));
        } else {
          const isWisdomise =
            afterLoginUrl.hostname === DOMAIN ||
            afterLoginUrl.origin.endsWith(`.${DOMAIN}`);
          if (isWisdomise) {
            replaceLocation(afterLoginUrl.href);
          } else {
            navigate('/');
          }
        }
      } else {
        navigate(afterLogin);
      }
    } else {
      navigate('/');
    }
  }, [navigate, searchParams]);

  return <Splash />;
}
