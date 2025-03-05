import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';
import { useTour } from '@reactour/tour';
import bullIcon from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSentiment/bullish.png';
import happyIcon from 'modules/insight/PageSocialRadar/components/SocialRadarSentiment/happy.png';
import { useSubscription } from 'api';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { homeSubscriptionsConfig } from '../../constants';

export default function useHotCoinsTour({ enabled }: { enabled: boolean }) {
  const [closed, setClosed] = useLocalStorage('closed-home-tour-mobile', false);
  const { setCurrentStep, setSteps, setIsOpen } = useTour();
  const { group } = useSubscription();
  const subConfig = homeSubscriptionsConfig[group];
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (closed || !isLoggedIn || !enabled || subConfig === true) return;
    setClosed(true);

    const rowSelector = `.tour-item-row:nth-child(${
      subConfig ? subConfig + 1 : 1
    })`;

    setSteps?.([
      {
        selector: rowSelector + ' .tour-item-sentiment',
        content: (
          <>
            <div>
              <img src={happyIcon} className="inline h-4" /> = Social Sentiment
            </div>
            <div>
              <img src={bullIcon} className="inline h-4 px-0.5" /> = Technical
              Analysis
            </div>
            <div className="mt-2">
              Find a coin with strong signals from both indicators.
            </div>
          </>
        ),
      },
      {
        selector: rowSelector,
        content:
          'Found a strong coin? Tap to validate signals and set up an auto-trade!',
      },
    ]);
    setCurrentStep(0);
    setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
