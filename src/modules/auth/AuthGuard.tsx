import { useEffect, type PropsWithChildren, useState } from 'react';
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
  const { data: account } = useAccountQuery();
  const [loading, setLoading] = useState(true);

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
    if (!account || !loading) return;
    if (!account.info.email_verified) {
      navigate('/auth/verify-email');
    } else if (account.register_status === 'PRIMARY') {
      navigate('/auth/secondary-signup');
    } else {
      setLoading(false);
      configCookieBot();
      customerIo.loadScript();
    }
  }, [loading, account, navigate]);

  return loading ? <Splash /> : <>{children}</>;
}
