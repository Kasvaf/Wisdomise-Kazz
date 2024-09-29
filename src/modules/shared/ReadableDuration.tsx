import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

export const ReadableDuration: FC<{
  value?: number | null;
  className?: string;
  emptyText?: string;
}> = ({ value, className, emptyText }) => {
  const { t } = useTranslation('common');

  const label = useMemo(() => {
    if (value === undefined || value === null) return null;
    // eslint-disable-next-line import/no-named-as-default-member
    dayjs.extend(duration);
    return dayjs.duration(value).humanize(false);
  }, [value]);

  return (
    <time className={clsx(!label && 'font-light opacity-70', className)}>
      {label ?? emptyText ?? t('not-available')}
    </time>
  );
};
