import { useEffect, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { useAccountQuery } from 'api';
import Splash from 'modules/base/Splash';
import { analytics } from 'config/segment';
import { useHubSpot } from 'config/hubSpot';
import configCookieBot from 'config/cookieBot';
import customerIo from 'config/customerIo';

export default function AuthGuard({ children }: PropsWithChildren) {
  useHubSpot();
  const navigate = useNavigate();
  const { data: account, isLoading } = useAccountQuery();

  useEffect(() => {
    const email = account?.email;
    if (email) {
      customerIo.identify(email);
      void analytics.identify(email, {
        userId: email,
        email,
      });
      Sentry.setUser({ email, wallet_address: account.wallet_address });
    }
  }, [account?.email, account?.wallet_address]);

  useEffect(() => {
    if (isLoading) return;
    configCookieBot();
    customerIo.loadScript();
  }, [account, navigate, isLoading]);

  return isLoading ? <Splash /> : <>{children}</>;
}
