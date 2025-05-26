import { useSubscription } from 'api';
import usePageTour from 'shared/usePageTour';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import bullIcon from '../TechnicalRadar/TechnicalRadarSentiment/bullish.png';
import happyIcon from '../SocialRadar/SocialRadarSentiment/happy.png';
import { homeSubscriptionsConfig } from './constants';

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
              <img src={happyIcon} className="inline h-4" /> = Social Mindshare
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
      {
        selector: '.tour-item-bottom-navbar',
        content: 'Discover top trends across different insights',
      },
    ],
  });
}
