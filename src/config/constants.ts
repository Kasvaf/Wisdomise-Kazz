import { isLocal, isProduction } from 'utils/version';

const { hostname } = window.location;
export const DOMAIN = isLocal
  ? 'wisdomise.com'
  : hostname.replace(/^(?:[\w-]+\.)*([\w-]+\.\w+)$/, '$1');
const subdomainPrefix = isProduction ? '' : 'stage-';

const makeOrigin = (name: string) =>
  `https://${subdomainPrefix}${name}.${DOMAIN}`;

export const API_ORIGIN = makeOrigin('api');
export const STRATEGY_ORIGIN = makeOrigin('strategy');
export const TEMPLE_ORIGIN = makeOrigin('temple');
export const ATHENA_FE = `https://${isProduction ? '' : 'stage.'}${DOMAIN}`;
export const APP_PANEL = makeOrigin('app');
export const ACCOUNT_PANEL_ORIGIN = makeOrigin('account-panel');

// account info:

export const APP_NAME = isLocal
  ? 'local-dashboard'
  : hostname.endsWith(`app.${DOMAIN}`)
  ? 'dashboard'
  : 'wealth';

export const RouterBaseName = (import.meta.env.VITE_BRANCH as string) || '';
