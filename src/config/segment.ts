import { AnalyticsBrowser } from '@segment/analytics-next';
import { isLocal, isProduction } from 'utils/version';

export const analytics = new AnalyticsBrowser();

export function configSegment() {
  if (!isLocal) {
    void analytics.load({
      writeKey: isProduction
        ? 'KziKXYCVqvj5eaHjp2rYzsuCpElkH04I'
        : 'iKtBnPRu3zSacgdBFQBh9GuKiPhoADEz',
    });
  }
}

export const trackClick =
  (place: string, location = 'dashboard') =>
  () => {
    void analytics.track('click_on', { place, location });
  };
