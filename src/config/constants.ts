import { isProduction } from 'utils/version';

export const JwtTokenKey = 'TOKEN';

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
export const LoginUrl = `${accountOrigin}/auth/login?app=${appName}`;
export const LogoutUrl = `${accountOrigin}/auth/logout?app=${appName}`;
