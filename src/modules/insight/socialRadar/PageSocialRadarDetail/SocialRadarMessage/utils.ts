import dayjs from 'dayjs';
import * as numerable from 'numerable';

export const formatCount = (n: number) =>
  numerable.format(n, '0,0 a', {
    rounding: v => Number(v.toFixed(1)),
  });

export const formatDate = (d: string) => dayjs(d).format('MMM D - HH:mm');
