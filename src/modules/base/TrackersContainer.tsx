import { type PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { useAccountQuery } from 'api';
import { saveUserMultiKeyValue } from 'api/userStorage';
import { useTelegram } from 'modules/base/mini-app/TelegramProvider';
import useStartParams from 'modules/autoTrader/useStartParams';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { analytics, configSegment } from 'config/segment';
import configCookieBot from 'config/cookieBot';
import customerIo from 'config/customerIo';
import oneSignal from 'config/oneSignal';
import { isDebugMode, isMiniApp } from 'utils/version';
import { useIsLoggedIn } from './auth/jwt-store';

const GTM_ID = import.meta.env.VITE_GTM as string | undefined;

function addGtm() {
  if (!GTM_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), 'event': 'gtm.js' });
  const f = document.querySelectorAll('script')[0];
  const j = document.createElement('script');
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?l=dataLayer&id=' + GTM_ID;
  f.parentNode?.insertBefore(j, f);
}

const params = ['utm_source', 'utm_medium', 'utm_campaign'];
const getUtmParams = () => ({
  ...JSON.parse(localStorage.getItem('first_utm') || '{}'),
  ...Object.fromEntries(
    Object.entries(JSON.parse(localStorage.getItem('last_utm') || '{}')).map(
      ([k, v]) => ['last_' + k, v],
    ),
  ),
});

const TrackersContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const { isEmbeddedView } = useEmbedView();
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const startParams = useStartParams();
  const isLoggedIn = useIsLoggedIn();
  const { data: account, isLoading } = useAccountQuery();

  // add gtag and preserve utm params for later customer io
  useEffect(() => {
    if (initialized) return; // already initialized
    if (isMiniApp && !webApp) return; // wait for telegram provider
    setInitialized(true);

    const [spType, utmSource, utmMedium, utmCampaign] = startParams;
    if (
      isMiniApp &&
      spType === 'utm' &&
      !location.search.includes('utm_campaign')
    ) {
      const s = new URLSearchParams(window.location.search);
      s.set('utm_source', utmSource);
      s.set('utm_medium', utmMedium);
      s.set('utm_campaign', utmCampaign);
      window.location.href =
        window.location.origin + window.location.pathname + '?' + s.toString();
    } else {
      // store all utm params for later use of identify
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('utm_source')) {
        const utmParams = Object.fromEntries(
          params.map(p => [p, searchParams.get(p)]),
        );

        localStorage.setItem('last_utm', JSON.stringify(utmParams));
        if (!localStorage.getItem('first_utm')) {
          localStorage.setItem('first_utm', JSON.stringify(utmParams));
        }
      }

      !isEmbeddedView && isDebugMode && configCookieBot();
      addGtm();
    }
  }, [initialized, isEmbeddedView, startParams, webApp]);

  useEffect(() => {
    const email = account?.email;
    if (isLoggedIn && email) {
      customerIo.identify(email);

      configSegment();
      void analytics.identify(email, {
        userId: email,
        email,
        ...getUtmParams(),
      });
      void saveUserMultiKeyValue(getUtmParams());
      Sentry.setUser({ email, wallet_address: account.wallet_address });
    }
  }, [account?.email, account?.wallet_address, isLoggedIn]);

  // one-signal
  useEffect(() => {
    if (!isLoggedIn) {
      void oneSignal.setExternalId(undefined);
    } else if (account?.email && account.info) {
      void oneSignal.setExternalId(account.email);
    }
  }, [isLoggedIn, account?.email, account?.info]);

  // customerIo once logged in
  useEffect(() => {
    if (isLoading) return;
    customerIo.loadScript();
  }, [account, navigate, isLoading]);

  return <>{children}</>;
};

export default TrackersContainer;
