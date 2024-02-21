import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import * as dayjs from 'dayjs';
import configAxios from './axios';
import configDayjs from './dayjs';
import configI18n from './i18n';
import { configSegment } from './segment';
import configSentry from './sentry';
import configAnalytics from './analytics';

configAxios();
configSentry();
configSegment();
configAnalytics();
configI18n();
configDayjs();

let lang = 'en';
axios.interceptors.request.use(config => {
  config.headers.set('Accept-Language', lang);
  return config;
}, null);

export default function useConfig() {
  const { i18n } = useTranslation();
  useEffect(() => {
    dayjs.locale(i18n.language);
    lang = i18n.language;
  }, [i18n]);
}
