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
  (place: string, rest: Record<string, any> = {}) =>
  () => {
    void analytics.track('click_on', { place, location: 'dashboard', ...rest });
  };

export const track = (
  eventName: 'click_on' | 'Click On' | `Feedback ${string}`,
  payload: Record<string, string | number> = {},
) => {
  void analytics.track(eventName, {
    location: 'dashboard',
    ...payload,
  });
};
