import { useEffect, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAccountQuery } from 'api';
import Splash from 'modules/base/Splash';
import { analytics, configSegment } from 'config/segment';
import { useHubSpot } from 'config/hubSpot';
import configCookieBot from 'config/cookieBot';
import customerIo from 'config/customerIo';
import oneSignal from 'config/oneSignal';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useDebugMode } from 'shared/useDebugMode';
import { useIsLoggedIn } from './jwt-store';
import { UserEngageFlow } from './UserEngageFlow';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isEmbeddedView } = useEmbedView();

  useHubSpot();
  useDebugMode();
  const navigate = useNavigate();
  const { data: account, isLoading } = useAccountQuery();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    const email = account?.email;
    if (isLoggedIn && email) {
      customerIo.identify(email);

      configSegment();
      void analytics.identify(email, {
        userId: email,
        email,
      });
      Sentry.setUser({ email, wallet_address: account.wallet_address });
    }
  }, [account?.email, account?.wallet_address, isLoggedIn]);

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

  return isLoading ? (
    <Splash />
  ) : (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
      <UserEngageFlow />
    </GoogleOAuthProvider>
  );
}
