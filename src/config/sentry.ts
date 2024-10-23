import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { isLocal } from 'utils/version';

export default function configSentry() {
  if (!isLocal) {
    Sentry.init({
      dsn: 'https://79fe673a0ca923d0ae50321a49d10eec@sentry.wisdomise.com/13',
      integrations: [new BrowserTracing()],
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampler: () => 0,
    });
  }
}
