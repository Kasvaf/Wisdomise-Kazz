import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'usehooks-ts';
import { HoverTooltip } from './HoverTooltip';

export const ReadableDate: FC<{
  value?: Date | string | number | null;
  format?: string;
  className?: string;
  emptyText?: string;
  popup?: boolean;
  suffix?: string | boolean;
}> = ({ value, className, format, popup = true, emptyText, suffix }) => {
  const { t } = useTranslation('common');
  const [tick, setTick] = useState(1); // used as dependency to update content

  const date = useMemo(
    () => (value === undefined || value === null ? null : dayjs(value)),
    [value],
  );

  const refreshTime = useMemo(() => {
    if (!date || !tick) return null;
    const diff = Math.abs(date.diff(Date.now(), 'milliseconds'));
    return diff < 120_000 ? 1000 : diff < 3_600_000 ? 60_000 : 600_000;
  }, [date, tick]);

  const content = useMemo(() => {
    if (!date || !tick) return null;
    let label = '';
    if (typeof format === 'string') {
      label = date.format(format);
    } else {
      const secondsDiff = Math.abs(date.diff(Date.now(), 'second'));
      label =
        secondsDiff < 60
          ? `${secondsDiff}s ${
              typeof suffix === 'string'
                ? suffix
                : suffix === true
                  ? ' Ago'
                  : ''
            }`
          : `${date
              .fromNow(!!(suffix === false || typeof suffix === 'string'))
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
    return {
      label,
      tooltip,
    };
  }, [date, format, suffix, tick]);

  useInterval(() => {
    if (!date) return;
    setTick(p => p + 1);
  }, refreshTime);

  const disabled = !popup || !content?.tooltip;

  return (
    <HoverTooltip disabled={disabled} title={content?.tooltip}>
      <time
        className={clsx(
          content?.label && !disabled && 'cursor-help',
          !content?.label && 'font-light opacity-70',
          className,
        )}
      >
        {content?.label ?? emptyText ?? t('not-available')}
      </time>
    </HoverTooltip>
  );
};
