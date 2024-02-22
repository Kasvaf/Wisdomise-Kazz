import axios, { type AxiosError } from 'axios';
import { getJwtToken } from 'modules/auth/jwt-store';
import { AFTER_LOGIN_KEY } from 'modules/auth/constants';
import { login } from 'modules/auth/authHandlers';
import { API_ORIGIN, RouterBaseName, TEMPLE_ORIGIN } from './constants';

export default function configAxios() {
  axios.defaults.baseURL = TEMPLE_ORIGIN + '/api/v1/';

  /**
   * Requset Interceptors
   * Add Authorization Token
   */
  axios.interceptors.request.use(config => {
    if (config.url?.startsWith(API_ORIGIN)) {
      config.headers.set(
        'Authorization',
        `Token ${import.meta.env.VITE_API_TOKEN as string}`,
      );
    } else {
      const jwtToken = getJwtToken();
      if (jwtToken) {
        config.headers.set('Authorization', 'Bearer ' + jwtToken);
      }
    }

    return config;
  }, null);

  /**
   * Response Interceptors
   * Redirect to login on 403
   */
  axios.interceptors.response.use(null, async (error: AxiosError) => {
    if (error.response?.status === 403) {
      const { hash, pathname, search } = window.location;
      login(
        `${AFTER_LOGIN_KEY}=${
          RouterBaseName ? hash.substring(1) : pathname + search
        }`,
      );
    }
    throw error;
  });
}
