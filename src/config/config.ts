import { configAxios } from "./axios";
import { configCrisp } from "./crisp";
import { configDayjs } from "./dayjs";
import { configSentry } from "./sentry";

export function configApp() {
  configAxios();
  configDayjs();
  configCrisp();
  configSentry();
}
