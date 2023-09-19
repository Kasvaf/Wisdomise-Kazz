import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { isLocal } from 'utils/version';

export default function configSentry() {
  if (!isLocal) {
    Sentry.init({
      dsn: 'https://ee6306165f3f4aef867f1fa37bcbf494@sentry.wisdomise.io/9',
      integrations: [new BrowserTracing()],
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1,
    });
  }
}
