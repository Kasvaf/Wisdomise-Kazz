import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// --- Shared ticker (module-level singleton) ---
const subscribers = new Set<React.Dispatch<React.SetStateAction<number>>>();
let intervalId: number | null = null;
let tickValue = 0;

function subscribe(setter: React.Dispatch<React.SetStateAction<number>>) {
  subscribers.add(setter);

  if (intervalId == null) {
    intervalId = window.setInterval(() => {
      tickValue++;
      for (const dispatch of subscribers) {
        dispatch(tickValue);
      }
    }, 1000);
  }

  return () => {
    subscribers.delete(setter);
    if (subscribers.size === 0 && intervalId != null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

// --- Component ---
export const ReadableDate: FC<{
  value?: Date | string | number | null;
  format?: string;
  className?: string;
  emptyText?: string;
  popup?: boolean;
  suffix?: string | boolean;
}> = ({ value, className, format, popup = true, emptyText, suffix }) => {
  const { t } = useTranslation('common');
  const [tick, setTick] = useState(tickValue);

  // subscribe to global ticker
  useEffect(() => subscribe(setTick), []);

  const date = useMemo(
    () => (value === undefined || value === null ? null : dayjs(value)),
    [value],
  );

  const content = useMemo(() => {
    if (!date || !tick) return null;
    let label = '';
    if (typeof format === 'string') {
      label = date.format(format);
    } else {
      label = `${date
        .fromNow(!!(suffix === false || typeof suffix === 'string'))
        .replace(' Seconds', 's')
        .replace(' Second', 's')
        .replace(' Minutes', 'm')
        .replace(' Minute', 'm')
        .replace(' Hours', 'h')
        .replace(' Hour', 'h')
        .replace(' Days', 'D')
        .replace(' Day', 'D')
        .replace(' Weeks', 'W')
        .replace(' Week', 'W')
        .replace(' Months', 'M')
        .replace(' Month', 'M')
        .replace(' Years', 'Y')
        .replace(' Year', 'Y')} ${
        typeof suffix === 'string' ? suffix : ''
      }`.trim();
    }
    const tooltip = date.format('ddd, MMM D, YYYY h:mm:ss A');
    return { label, tooltip };
  }, [date, format, suffix, tick]);

  const disabled = !popup || !content?.tooltip;

  return (
    <time
      className={clsx(!content?.label && 'font-light opacity-70', className)}
      {...(!disabled && { title: content?.tooltip })}
    >
      {content?.label ?? emptyText ?? t('not-available')}
    </time>
  );
};
