import { ACCOUNT_PANEL_ORIGIN, APP_PANEL } from 'config/constants';
import { JWT_TOKEN_KEY, REMOTE_LOGIN_KEY } from './constants';

export function login(params?: any) {
  localStorage.removeItem(JWT_TOKEN_KEY);
  window.location.href = `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/login${
    typeof params === 'string' ? `?${params}` : ''
  }`;
}

export function remoteLogin(params?: any) {
  localStorage.removeItem(JWT_TOKEN_KEY);
  window.location.href = `${APP_PANEL}/auth/login?${REMOTE_LOGIN_KEY}=${encodeURIComponent(
    window.location.origin,
  )}${typeof params === 'string' ? `&${params}` : ''}`;
}

export function logout(params?: any) {
  localStorage.removeItem(JWT_TOKEN_KEY);
  window.location.href = `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/logout${
    typeof params === 'string' ? `?${params}` : ''
  }`;
}
