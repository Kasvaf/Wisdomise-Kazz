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
