import { isLocal } from 'utils/version';
import { ACCOUNT_PANEL_ORIGIN, APP_PANEL } from 'config/constants';
import { JWT_TOKEN_KEY, REMOTE_LOGIN_KEY } from './constants';

let once = 0;

export function login(params?: any) {
  if (once++) return;
  localStorage.removeItem(JWT_TOKEN_KEY);

  window.location.href = isLocal
    ? `${APP_PANEL}/auth/login?${REMOTE_LOGIN_KEY}=${encodeURIComponent(
        window.location.origin,
      )}${typeof params === 'string' ? `&${params}` : ''}`
    : `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/login${
        typeof params === 'string' ? `?${params}` : ''
      }`;
}

export function logout(params?: any) {
  if (once++) return;
  localStorage.removeItem(JWT_TOKEN_KEY);
  window.location.href = isLocal
    ? `${APP_PANEL}/auth/logout`
    : `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/logout${
        typeof params === 'string' ? `?${params}` : ''
      }`;
}
