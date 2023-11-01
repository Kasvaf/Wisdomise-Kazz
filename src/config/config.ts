import configAxios from './axios';
import configCrisp from './crisp';
import configDayjs from './dayjs';
import { configSegment } from './segment';
import configSentry from './sentry';

export default function configApp() {
  configAxios();
  configDayjs();
  configCrisp();
  configSentry();
  configSegment();
}
