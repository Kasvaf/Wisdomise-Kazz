/* eslint-disable import/no-unassigned-import */
/* eslint-disable import/no-named-as-default-member */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utcDate from 'dayjs/plugin/utc';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import 'dayjs/locale/ja';

export default function configDayjs() {
  dayjs.extend(updateLocale);
  dayjs.extend(relativeTime);
  dayjs.extend(utcDate);
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(weekOfYear);
  dayjs.extend(weekYear);
  dayjs.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s Ago',
      s: 'Just Now',
      m: '1m',
      mm: '%d‌m',
      h: '1H',
      hh: '%d‌H',
      d: '1D',
      dd: '%d‌D',
      M: '!M',
      MM: '%d‌M',
      y: '1Y',
      yy: '%d‌Y',
    },
  });
}
