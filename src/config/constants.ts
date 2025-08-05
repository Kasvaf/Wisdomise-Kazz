import { isLocal, isProduction } from 'utils/version';

const { hostname, origin } = window.location;

const DOMAIN = isLocal
  ? 'goatx.trade'
  : hostname.replace(/^(?:[\w-]+\.)*([\w-]+\.\w+)$/, '$1');

const subdomainPrefix = isProduction ? '' : 'stage';

function makeOrigin(serviceName: string): string {
  if (import.meta.env.VITE_STAGE_API_PROXY === 'true') {
    return new URL(`/${serviceName}-proxy`, origin).toString();
  }

  const subdomainParts = [subdomainPrefix, serviceName].filter(Boolean);
  const fullDomain = subdomainParts.length
    ? `${subdomainParts.join('-')}.${DOMAIN}`
    : DOMAIN;

  return `https://${fullDomain}`;
}

export const APP_PANEL = makeOrigin('');
export const GRPC_ORIGIN = makeOrigin('grpc');
export const TEMPLE_ORIGIN = makeOrigin('temple');
export const INVESTMENT_ORIGIN = makeOrigin('wsdm-app');
export const ACCOUNT_PANEL_ORIGIN = makeOrigin('account-panel');

export const MAIN_LANDING = (lng: string) => {
  const subdomain = isProduction ? '' : 'stage.';
  return `https://${subdomain}${DOMAIN}/${lng}`;
};

export const RouterBaseName = (import.meta.env.VITE_BRANCH as string) || '';

export const STRIPE_CLIENT_PUBLIC_KEY = import.meta.env
  .VITE_STRIPE_CLIENT_PUBLIC_KEY as string;

export const TELEGRAM_BOT_BASE_URL = import.meta.env
  .VITE_TELEGRAM_BOT_BASE_URL as `${string}://${string}`;
