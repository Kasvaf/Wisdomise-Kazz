import { useEffect, useState, type PropsWithChildren } from 'react';
import { useTelegram } from 'modules/autoTrader/layout/TelegramProvider';
import useStartParams from 'modules/autoTrader/useStartParams';
import { isMiniApp } from 'utils/version';

const gaId = import.meta.env.VITE_GA;
const GtagContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const { webApp } = useTelegram();
  const startParams = useStartParams();

  useEffect(() => {
    if (!gaId || initialized) return; // not enabled, or already initialized
    if (isMiniApp && !webApp) return; // wait for telegram provider
    setInitialized(true);

    const [spType, utmSource, utmMedium, utmCampaign] = startParams;
    if (isMiniApp && spType === 'utm' && !window.utmEnabled) {
      const s = new URLSearchParams(window.location.search);
      s.set('utm_source', utmSource);
      s.set('utm_medium', utmMedium);
      s.set('utm_campaign', utmCampaign);
      window.location.href =
        window.location.origin + window.location.pathname + '?' + s.toString();
    }
  }, [initialized, startParams, webApp]);

  return <>{children}</>;
};

export default GtagContainer;
