import { isLocal } from 'utils/version';
import { ACCOUNT_PANEL_ORIGIN, APP_PANEL } from 'config/constants';
import { AFTER_LOGIN_KEY } from './constants';
import { delJwtToken } from './jwt-store';

let once = 0;

export function login(params = '') {
  if (once++) return;
  delJwtToken();
  window.location.href = isLocal
    ? `${APP_PANEL}/auth/login?${AFTER_LOGIN_KEY}=${encodeURIComponent(
        window.location.origin,
      )}`
    : `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/login?${params}`;
}

export function logout(params?: any) {
  if (once++) return;
  delJwtToken();

  window.location.href = isLocal
    ? `${APP_PANEL}/auth/logout`
    : `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/logout${
        typeof params === 'string' ? `?${params}` : ''
      }`;
}
