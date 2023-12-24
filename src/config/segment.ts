import { AnalyticsBrowser } from '@segment/analytics-next';
import { isProduction } from 'utils/version';

export const analytics = new AnalyticsBrowser();

export function configSegment() {
  if (isProduction) {
    void analytics.load({
      writeKey: 'KziKXYCVqvj5eaHjp2rYzsuCpElkH04I',
    });
  }
}

export const trackClick = (place: string) => () => {
  void analytics.track('click_on', { place });
};
