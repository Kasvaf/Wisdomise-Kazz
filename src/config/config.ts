import { configAxios } from "./axios";
import { configSentry } from "./sentry";

export function configApp() {
  configAxios();
  configSentry();
}
