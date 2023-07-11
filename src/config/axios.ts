import axios, { AxiosError } from "axios";
import { JwtTokenKey, LoginUrl } from "./constants";
import DB from "./keys";

export const jwtToken = "";

export function configAxios() {
  axios.defaults.baseURL = DB + "/api/v1/";

  axios.interceptors.request.use((config) => {
    config.headers.set(
      "Authorization",
      "Bearer " + (localStorage.getItem(JwtTokenKey) || jwtToken)
    );

    return config;
  }, null);

  axios.interceptors.response.use(null, (error: AxiosError) => {
    if (error.response?.status === 403) {
      localStorage.removeItem(JwtTokenKey);
      window.location.href = LoginUrl;
    }

    return Promise.reject(error);
  });
}
