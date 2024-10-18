import axios, { type AxiosError } from 'axios';
import { delJwtToken, getJwtToken } from 'modules/base/auth/jwt-store';
import { refreshAccessToken } from 'api/auth';
import { TEMPLE_ORIGIN } from './constants';

const isAuthError = (status?: number) => status === 401 || status === 403;

export default function configAxios() {
  axios.defaults.baseURL = TEMPLE_ORIGIN + '/api/v1/';

  /**
   * Requset Interceptors
   * Add Authorization Token
   */
  axios.interceptors.request.use(config => {
    const jwtToken = getJwtToken();
    if (jwtToken) {
      config.headers.set('Authorization', 'Bearer ' + jwtToken);
    }

    return config;
  }, null);

  /**
   * Response Interceptors
   * Redirect to login on 403
   */
  axios.interceptors.response.use(null, async (error: AxiosError) => {
    if (isAuthError(error.response?.status)) {
      console.log('🔴', error.config?.url);

      if (error.config?.url?.includes('account/auth/')) {
        delJwtToken();
      } else {
        if (getJwtToken()) {
          try {
            await refreshAccessToken();
          } catch {}
        }
      }
    }
    throw error;
  });
}
