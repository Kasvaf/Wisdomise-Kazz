import { isLocal, isProduction } from 'utils/version';

const { hostname } = window.location;
export const DOMAIN = isLocal
  ? 'wisdomise.com'
  : hostname.replace(/^(?:[\w-]+\.)*([\w-]+\.\w+)$/, '$1');
const subdomainPrefix = isProduction ? '' : 'stage-';

export const SUPPORT_EMAIL = 'support@wisdomise.com';

const makeOrigin = (name: string) => {
  if (import.meta.env.VITE_STAGE_API_PROXY === 'true') {
    return `${window.location.origin}/${name}-proxy`;
  }
  return `https://${subdomainPrefix}${name}.${DOMAIN}`;
};

export const CHATAPP_ORIGIN = makeOrigin('chatapp');
export const TEMPLE_ORIGIN = makeOrigin('temple');
export const MAIN_LANDING = (lng: string) =>
  `https://${isProduction ? '' : 'stage.'}${DOMAIN}/${lng}`;
export const APP_PANEL = makeOrigin('app');
export const ACCOUNT_PANEL_ORIGIN = makeOrigin('account-panel');

// account info:

export const INVESTMENT_FE = `https://${
  isProduction ? '' : 'stage-'
}investment.${DOMAIN}`;

export const RouterBaseName = (import.meta.env.VITE_BRANCH as string) || '';

export const STRIPE_CLIENT_PUBLIC_KEY = import.meta.env
  .VITE_STRIPE_CLIENT_PUBLIC_KEY as string;
