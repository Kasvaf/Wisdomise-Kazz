import { useMemo, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as UpIcon } from './up.svg';
import { ReactComponent as DownIcon } from './down.svg';

function DirectionIcon({
  className,
  value,
}: {
  className?: string;
  value: 'up' | 'down' | 'neutral';
}) {
  return (
    <>
      <span
        className={clsx(
          'inline-flex size-4 items-center justify-center rounded-full bg-v1-surface-l4',
          'text-xxs text-v1-content-secondary',
          value === 'neutral' && 'hidden',
          className,
        )}
      >
        {value === 'up' ? <UpIcon /> : value === 'down' ? <DownIcon /> : <></>}
      </span>
    </>
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
}) {
  const direction = useMemo(() => {
    if (!directionType || directionType === 'auto') {
      if (typeof value !== 'number' || value === 0) {
        return 'neutral';
      }
      return value > 0 ? 'up' : 'down';
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
        <DirectionIcon value={direction} className="mr-1 shrink-0" />
      )}
      {prefix}
      {showSign && (
        <>{direction === 'up' ? '+' : direction === 'down' ? '-' : ''}</>
      )}
      <ReadableNumber
        value={typeof value === 'number' ? Math.abs(value) : null}
        popup={popup ?? 'never'}
        label={label}
        className="text-inherit"
      />
      {suffix}
    </span>
  );
}
