import { useEffect, useState, type PropsWithChildren } from 'react';
import { useTelegram } from 'modules/autoTrader/layout/TelegramProvider';
import useStartParams from 'modules/autoTrader/useStartParams';
import { isMiniApp } from 'utils/version';

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

const GtagContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const { webApp } = useTelegram();
  const startParams = useStartParams();

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
      addGtm();
    }
  }, [initialized, startParams, webApp]);

  return <>{children}</>;
};

export default GtagContainer;
