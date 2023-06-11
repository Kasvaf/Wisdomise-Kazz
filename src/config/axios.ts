import axios from "axios";
import DB from "./keys";

export const jwtToken = "";

export function configAxios() {
  axios.defaults.baseURL = DB + "/api/v1/";

  axios.interceptors.request.use(
    (config) => {
      config.headers.set(
        "Authorization",
        "Bearer " + (localStorage.getItem("WISDOMISE_TOKEN_KEY") || jwtToken)
      );

      return config;
    },
    () => void 0
  );
}
