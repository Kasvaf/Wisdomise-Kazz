/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable import/no-unresolved */

import * as i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from 'virtual:i18next-loader';
import { notification } from 'antd';
import { isProduction } from 'utils/version';

const validLang = /^([a-z]{2}(-[a-z]{2})?)$/;
export default function configI18n() {
  void i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: 'en',
      detection: {
        order: ['querystring', 'localStorage', 'sessionStorage'],
        convertDetectedLanguage: lng => (validLang.test(lng) ? lng : 'en'),
      },
      saveMissing: !isProduction,
      missingKeyHandler: (
        lngs,
        ns,
        key,
        fallbackValue,
        updateMissing,
        options,
      ) => {
        if (isProduction) {
          // TODO: send sentry log!
          console.error('locale key not found', ns, key);
        } else {
          notification.error({
            message: `Locale key not found "${ns}:${key}"`,
          });
        }
      },
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      react: {
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b', 'em'],
      },
    });
}
