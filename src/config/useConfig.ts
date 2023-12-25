import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

export default function useConfig() {
  const { i18n } = useTranslation();
  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n]);
}
