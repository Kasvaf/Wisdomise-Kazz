import { useSubscription } from 'api';
import usePageTour from 'shared/usePageTour';
import bullIcon from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSentiment/bullish.png';
import happyIcon from 'modules/insight/PageSocialRadar/components/SocialRadarSentiment/happy.png';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { homeSubscriptionsConfig } from '../../constants';

export default function useHotCoinsTour({ enabled }: { enabled: boolean }) {
  const { group } = useSubscription();
  const subConfig = homeSubscriptionsConfig[group];
  const isLoggedIn = useIsLoggedIn();

  const rowSelector = `.tour-item-row:nth-child(${
    subConfig ? +subConfig + 1 : 1
  })`;

  usePageTour({
    key: 'home-tour-mobile',
    enabled: enabled && isLoggedIn && subConfig !== true,
    steps: [
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
    ],
  });
}
