import { isProduction } from 'utils/version';

export const RouterBaseName = (import.meta.env.VITE_BRANCH as string) || '';

const { hostname } = window.location;
const appName =
  hostname === 'localhost'
    ? 'local-dashboard'
    : hostname.endsWith('app.wisdomise.io')
    ? 'dashboard'
    : 'wealth';

const accountOrigin = `https://${
  isProduction ? '' : 'stage-'
}account.wisdomise.io`;

export const JwtTokenKey = 'TOKEN';
export const LoginUrl = `${accountOrigin}/auth/login?app=${appName}&v=${RouterBaseName}`;
export const LogoutUrl = `${accountOrigin}/auth/logout?app=${appName}&v=${RouterBaseName}`;
