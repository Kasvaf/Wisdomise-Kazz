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
      future: 'In %s',
      past: '%s Ago',
      s: '<1 Minute',
      m: '1 Minute',
      mm: '%d Minutes',
      h: '1 Hour',
      hh: '%d Hours',
      d: '1 Day',
      dd: '%d Days',
      M: '1 Month',
      MM: '%d Months',
      y: '1 Year',
      yy: '%d Years',
    },
  });
}
