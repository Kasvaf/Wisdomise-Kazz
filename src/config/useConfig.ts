import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as dayjs from 'dayjs';
import { delJwtToken, getJwtToken } from 'modules/base/auth/jwt-store';
import { refreshAccessToken } from 'api/auth';
import configDayjs from './dayjs';
import configI18n from './i18n';
import configSentry from './sentry';
import { queryClient } from './reactQuery';
import oneSignal from './oneSignal';
import { configOfetch } from './ofetch';

let lang = 'en';

configSentry();
configI18n();
configDayjs();
configOfetch({
  delJwtToken,
  getJwtToken,
  getLang: () => lang,
  refreshAccessToken,
});
// void oneSignal.init();

export default function useConfig() {
  const { i18n } = useTranslation();
  useEffect(() => {
    dayjs.locale(i18n.language);
    lang = i18n.language;
    void queryClient.refetchQueries();
  }, [i18n.language]);
}
