import ReactGA from 'react-ga4';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { useTelegram } from 'modules/autoTrader/layout/TelegramProvider';
import useStartParams from 'modules/autoTrader/useStartParams';
import { isMiniApp } from 'utils/version';

const gaId = import.meta.env.VITE_GA;
const GtagContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const { webApp } = useTelegram();
  const startParams = useStartParams();

  const location = useLocation();
  useEffect(() => {
    if (!initialized) return;
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
    });
  }, [initialized, location]);

  useEffect(() => {
    if (!gaId || initialized) return; // not enabled, or already initialized
    if (isMiniApp && !webApp) return; // wait for telegram provider
    setInitialized(true);

    const [spType, utmSource, utmMedium, utmCampaign] = startParams;
    ReactGA.initialize(gaId, {
      gtagOptions:
        spType === 'utm'
          ? {
              campaign_source: utmSource,
              campaign_medium: utmMedium,
              campaign_name: utmCampaign,
            }
          : {},
    });
  }, [initialized, startParams, webApp]);

  return <>{children}</>;
};

export default GtagContainer;
