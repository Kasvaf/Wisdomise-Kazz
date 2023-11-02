/* eslint-disable import/no-unresolved */

import * as i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from 'virtual:i18next-loader';

export default function configI18n() {
  void i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
}
