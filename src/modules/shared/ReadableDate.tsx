import dayjs from 'dayjs';
import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { Tooltip } from 'antd';
import { useInterval } from 'usehooks-ts';

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
    <Tooltip
      color="#151619"
      overlayInnerStyle={{
        padding: '0.75rem',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
      }}
      title={content?.tooltip}
      overlayClassName="pointer-events-none"
      open={popup && content?.tooltip ? undefined : false}
    >
      <time
        className={clsx(
          content?.label ? 'cursor-alias' : 'font-light opacity-70',
          className,
        )}
      >
        {content?.label ?? emptyText ?? t('not-available')}
      </time>
    </Tooltip>
  );
};
