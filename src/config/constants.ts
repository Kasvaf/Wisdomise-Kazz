import { isProduction } from 'utils/version';

const { hostname } = window.location;
const Domain =
  hostname === 'localhost'
    ? 'wisdomise.com'
    : hostname.replace(/^(?:[\w-]+\.)*([\w-]+\.\w+)$/, '$1');
const subdomainPrefix = isProduction ? '' : 'stage-';

const makeOrigin = (name: string) =>
  `https://${subdomainPrefix}${name}.${Domain}`;

export const API_ORIGIN = makeOrigin('api');
export const STRATEGY_ORIGIN = makeOrigin('strategy');
export const TEMPLE_ORIGIN = makeOrigin('temple');
export const ATHENA_FE = makeOrigin('athena');
export const ACCOUNT_ORIGIN = makeOrigin('account');
export const ACCOUNT_PANEL_ORIGIN = makeOrigin('account-panel');

// account info:

const appName =
  hostname === 'localhost'
    ? 'local-dashboard'
    : hostname.endsWith(`app.${Domain}`)
    ? 'dashboard'
    : 'wealth';

export const JwtTokenKey = 'TOKEN';
export const RouterBaseName = (import.meta.env.VITE_BRANCH as string) || '';
export const LoginUrl = `${ACCOUNT_ORIGIN}/auth/login?app=${appName}&v=${RouterBaseName}`;
export const LogoutUrl = `${ACCOUNT_ORIGIN}/auth/logout?app=${appName}&v=${RouterBaseName}`;
