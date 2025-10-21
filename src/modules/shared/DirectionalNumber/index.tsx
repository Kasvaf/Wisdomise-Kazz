import { clsx } from 'clsx';
import { type ReactNode, useMemo } from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';
import type { FormatNumberOptions } from 'utils/numbers';
import { ReactComponent as DownIcon } from './down.svg';
import { ReactComponent as UpIcon } from './up.svg';

function DirectionIcon({
  className,
  value,
}: {
  className?: string;
  value: 'up' | 'down' | 'neutral';
}) {
  return (
    <span
      className={clsx(
        'inline-flex size-2 items-center justify-center rounded-full',
        'text-v1-content-secondary text-xxs [&_svg]:mb-px [&_svg]:size-full',
        value === 'neutral' && 'hidden',
        className,
      )}
    >
      {value === 'up' ? <UpIcon /> : value === 'down' ? <DownIcon /> : <></>}
    </span>
  );
}

export function DirectionalNumber({
  showIcon,
  showSign,
  suffix,
  prefix,
  value,
  className,
  popup,
  direction: directionType,
  label,
  format,
  emptyText,
}: {
  className?: string;
  value?: number | null;
  direction?: 'up' | 'down' | 'neutral' | 'auto';
  popup?: 'never' | 'auto';
  showIcon?: boolean;
  showSign?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  label?: string;
  format?: Partial<FormatNumberOptions>;
  emptyText?: string | undefined;
}) {
  const direction = useMemo(() => {
    if (!directionType || directionType === 'auto') {
      if (typeof value !== 'number') {
        return 'neutral';
      }
      return value >= 0 ? 'up' : 'down';
    }
    return directionType;
  }, [value, directionType]);

  return (
    <span
      className={clsx(
        direction === 'neutral' && 'text-v1-content-primary',
        direction === 'down' && 'text-v1-content-negative',
        direction === 'up' && 'text-v1-content-positive',
        'inline-flex items-center',
        className,
      )}
    >
      {showIcon !== false && (
        <DirectionIcon className="me-px shrink-0" value={direction} />
      )}
      {prefix}
      {showSign && (direction === 'up' ? '+' : direction === 'down' ? '-' : '')}
      <ReadableNumber
        className="text-inherit"
        emptyText={emptyText}
        format={format}
        label={label}
        popup={popup ?? 'never'}
        value={typeof value === 'number' ? Math.abs(value) : null}
      />
      {suffix}
    </span>
  );
}
