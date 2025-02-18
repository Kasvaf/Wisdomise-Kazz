import dayjs from 'dayjs';
import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useInterval } from 'usehooks-ts';
import { HoverTooltip } from './HoverTooltip';

export const ReadableDate: FC<{
  value?: Date | string | number | null;
  format?: string;
  className?: string;
  emptyText?: string;
  popup?: boolean;
}> = ({ value, className, format, popup = true, emptyText }) => {
  const { t } = useTranslation('common');
  const [tick, setTick] = useState(1); // used as dependency to update content

  const date = useMemo(
    () => (value === undefined || value === null ? null : dayjs(value)),
    [value],
  );

  const refreshTime = useMemo(() => {
    if (!date || !tick) return null;
    return Math.abs(date.diff()) <= 3_600_000 ? 5000 : 600_000;
  }, [date, tick]);

  const content = useMemo(() => {
    if (!date || !tick) return null;
    const label =
      typeof format === 'string'
        ? date.format(format)
        : date
            .fromNow()
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
            .replace(' Year', 'Y');
    const tooltip = date.format('ddd, MMM D, YYYY h:mm:ss A');
    return {
      label,
      tooltip,
    };
  }, [date, format, tick]);

  useInterval(() => {
    if (!date) return;
    setTick(p => p + 1);
  }, refreshTime);

  const disabled = !popup || !content?.tooltip;

  return (
    <HoverTooltip title={content?.tooltip} disabled={disabled}>
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
