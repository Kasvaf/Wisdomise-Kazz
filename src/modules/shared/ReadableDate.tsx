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
      typeof format === 'string' ? date.format(format) : date.fromNow();
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

  return (
    <HoverTooltip
      title={content?.tooltip}
      disabled={!popup || !content?.tooltip}
    >
      <time
        className={clsx(
          content?.label ? 'cursor-help' : 'font-light opacity-70',
          className,
        )}
      >
        {content?.label ?? emptyText ?? t('not-available')}
      </time>
    </HoverTooltip>
  );
};
