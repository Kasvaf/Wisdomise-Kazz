import { isLocal, isProduction } from 'utils/version';

const { hostname } = window.location;
export const DOMAIN = isLocal
  ? 'wisdomise.com'
  : hostname.replace(/^(?:[\w-]+\.)*([\w-]+\.\w+)$/, '$1');
const subdomainPrefix = isProduction ? '' : 'stage-';

const makeOrigin = (name: string) =>
  `https://${subdomainPrefix}${name}.${DOMAIN}`;

export const API_ORIGIN = makeOrigin('api');
export const CHATAPP_ORIGIN = makeOrigin('chatapp');
export const TEMPLE_ORIGIN = makeOrigin('temple');
export const MAIN_LANDING = (lng: string) =>
  `https://${isProduction ? '' : 'stage.'}${DOMAIN}/${lng}`;
export const APP_PANEL = makeOrigin('app');
export const ACCOUNT_PANEL_ORIGIN = makeOrigin('account-panel');

// account info:

export const APP_NAME = isLocal
  ? 'local-dashboard'
  : hostname.endsWith(`app.${DOMAIN}`)
  ? 'dashboard'
  : 'wealth';

export const INVESTMENT_FE = `https://${
  isProduction ? '' : 'stage-'
}investment.${DOMAIN}`;

export const RouterBaseName = (import.meta.env.VITE_BRANCH as string) || '';

export const STRIPE_CLIENT_PUBLIC_KEY = import.meta.env
  .VITE_STRIPE_CLIENT_PUBLIC_KEY as string;
