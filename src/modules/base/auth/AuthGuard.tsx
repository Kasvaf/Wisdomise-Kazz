import { useEffect, type PropsWithChildren } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useLocalStorage } from 'usehooks-ts';
import { useAccountQuery } from 'api';
import Splash from 'modules/base/Splash';
import { analytics } from 'config/segment';
import { useHubSpot } from 'config/hubSpot';
import configCookieBot from 'config/cookieBot';
import customerIo from 'config/customerIo';
import oneSignal from 'config/oneSignal';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import OneTapLogin from './OneTapLogin';
import { useIsLoggedIn } from './jwt-store';
import { useModalLogin } from './ModalLogin';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isEmbeddedView } = useEmbedView();

  const [immediateLogin, setImediateLogin] = useLocalStorage(
    'immediateLogin',
    false,
  );
  const [forceLoginContent, forceLogin] = useModalLogin(false);

  useHubSpot();
  const navigate = useNavigate();
  const { data: account, isLoading } = useAccountQuery();
  const isLoggedIn = useIsLoggedIn();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const email = account?.email;
    if (isLoggedIn && email) {
      customerIo.identify(email);
      void analytics.identify(email, {
        userId: email,
        email,
      });
      Sentry.setUser({ email, wallet_address: account.wallet_address });
    }
  }, [account?.email, account?.wallet_address, isLoggedIn]);

  useEffect(() => {
    if (searchParams.has('debug')) {
      localStorage.setItem(
        'debug',
        searchParams.get('debug') === 'false' ? 'false' : 'true',
      );
      searchParams.delete('debug');
      setSearchParams(searchParams);
      window.location.reload();
    }
    /* immidiateLogin */
    if (searchParams.has('iml')) {
      setImediateLogin(true);
    }
  }, [searchParams, setImediateLogin, setSearchParams]);

  useEffect(() => {
    if (!isLoggedIn) {
      void oneSignal.setExternalId(undefined);
    } else if (account?.email && account.info) {
      void oneSignal.setExternalId(account.email);
    }
  }, [isLoggedIn, account?.email, account?.info]);

  useEffect(() => {
    if (isLoading) return;
    !isEmbeddedView && configCookieBot();
    customerIo.loadScript();
  }, [account, navigate, isLoading, isEmbeddedView]);

  useEffect(() => {
    if (immediateLogin && !isLoggedIn) {
      void forceLogin().then(() => setImediateLogin(false));
    }
  }, [immediateLogin, isLoggedIn, forceLogin, setImediateLogin]);

  return isLoading ? (
    <Splash />
  ) : (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {!isLoggedIn && !isEmbeddedView && (
        <>{immediateLogin ? forceLoginContent : <OneTapLogin />}</>
      )}
      {children}
    </GoogleOAuthProvider>
  );
}
