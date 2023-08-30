import axios, { type AxiosError } from 'axios';
import { tryParse } from 'utils/json';
import { isProduction } from 'utils/version';
import { JwtTokenKey, LoginUrl } from './constants';

export default function configAxios() {
  const temple = `https://${isProduction ? '' : 'stage-'}temple.wisdomise.io`;
  axios.defaults.baseURL = temple + '/api/v1/';

  /**
   * Requset Interceptors
   * Add Authorization Token
   */
  axios.interceptors.request.use(config => {
    const jwtToken = tryParse(localStorage.getItem(JwtTokenKey));
    if (jwtToken && typeof jwtToken === 'string') {
      config.headers.set('Authorization', 'Bearer ' + jwtToken);
    }

    return config;
  }, null);

  /**
   * Response Interceptors
   * Redirect to login on 403
   */
  axios.interceptors.response.use(null, async (error: AxiosError) => {
    if (error.response?.status === 403) {
      localStorage.removeItem(JwtTokenKey);
      window.location.href = LoginUrl;
    }
    throw error;
  });
}
