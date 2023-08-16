import axios, { AxiosError } from "axios";
import { JwtTokenKey, LoginUrl } from "./constants";
import { DB } from "./keys";
import { tryParse } from "utils/json";

export function configAxios() {
  axios.defaults.baseURL = DB + "/api/v1/";

  /**
   * Requset Interceptors
   * Add Authorization Token
   */
  axios.interceptors.request.use((config) => {
    const jwtToken = tryParse(localStorage.getItem(JwtTokenKey));
    if (jwtToken && typeof jwtToken === 'string') {
      config.headers.set("Authorization", "Bearer " + jwtToken);
    }

    return config;
  }, null);

  /**
   * Response Interceptors
   * Redirect to login on 403
   */
  axios.interceptors.response.use(null, (error: AxiosError) => {
    if (error.response?.status === 403) {
      localStorage.removeItem(JwtTokenKey);
      window.location.href = LoginUrl;
    }

    return Promise.reject(error);
  });
}
