import { ofetch as originalOfetch } from 'ofetch';
import * as Sentry from '@sentry/react';
import { isDebugMode } from 'utils/version';
import { TEMPLE_ORIGIN } from './constants';

let config: {
  getLang?: () => string | null;
  getJwtToken?: (gameAuth?: boolean) => string | null;
  delJwtToken?: () => void;
  refreshAccessToken?: () => Promise<void>;
} = {};

export const ofetch = originalOfetch.create({
  baseURL: `${TEMPLE_ORIGIN}/api/v1/`,
  onRequest: ({ options }) => {
    if (options.meta?.auth !== false) {
      const jwtToken = config?.getJwtToken?.(options.meta?.gameAuth);
      if (jwtToken) {
        options.headers.set('Authorization', `Bearer ${jwtToken}`);
      }
    }
    if (options.meta?.lang !== false) {
      const lang = config.getLang?.() || 'en';
      options.headers.set('Accept-Language', lang);
    }
  },
  onResponseError: async ({ request, response, options }) => {
    if ([401, 403].includes(response.status) && options.meta?.auth !== false) {
      if (isDebugMode) {
        console.log('🔴', request.toString());
      }
      if (request.toString().includes('account/auth/')) {
        config?.delJwtToken?.();
      } else {
        if (config?.getJwtToken?.() && config?.refreshAccessToken) {
          try {
            await config.refreshAccessToken();
          } catch {}
        }
      }
    } else {
      Sentry.withScope(scope => {
        scope.setExtra('url', response.url);
        scope.setExtra('status', response.status);

        Sentry.captureException(new Error(`API error: ${response.status}`));
      });
    }
  },
  retry: 2,
  retryStatusCodes: [401, 403],
});

export const configOfetch = (newConfig: typeof config) => {
  config = newConfig;
};
