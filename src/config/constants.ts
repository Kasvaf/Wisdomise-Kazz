import { isProduction } from 'utils/version';

export const JwtTokenKey = 'TOKEN';
export const appName = window.location.host.includes('localhost')
  ? 'local-'
  : '';

const accountOrigin = `https://${
  isProduction ? '' : 'stage-'
}account.wisdomise.io`;
export const LoginUrl = `${accountOrigin}/auth/login?app=${appName}wealth`;
export const LogoutUrl = `${accountOrigin}/auth/logout?app=${appName}wealth`;
