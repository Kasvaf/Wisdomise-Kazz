import { type FC, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ReactComponent as CheckIcon } from './check.svg';
import { ReactComponent as UnCheckIcon } from './uncheck.svg';

export const Toggle: FC<{
  value?: boolean;
  onChange?: (newVal: boolean) => void;
  trueLabel?: ReactNode;
  falseLabel?: ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}> = ({
  onChange,
  value,
  trueLabel,
  falseLabel,
  className,
  loading,
  disabled,
}) => {
  return (
    <div
      className={clsx(
        'inline-flex cursor-pointer items-center gap-2 text-xs',
        loading && 'animate-pulse',
        (loading || disabled) && 'pointer-events-none opacity-70',
        className,
      )}
      tabIndex={typeof onChange === 'function' ? 0 : -1}
      onClick={() => onChange?.(!value)}
    >
      {falseLabel && (
        <span
          className={clsx(
            'transition-all',
            (value === true || loading || disabled) && 'opacity-50',
          )}
        >
          {falseLabel}
        </span>
      )}
      <span className="relative h-[24px] w-[44px] overflow-hidden rounded-full">
        <UnCheckIcon
          className={clsx(
            'absolute inset-0 size-full transition-all duration-300',
            (loading || disabled) && 'grayscale',
            value === true && 'translate-x-1/2 opacity-0',
          )}
        />
        <CheckIcon
          className={clsx(
            'absolute inset-0 size-full transition-all duration-300',
            (loading || disabled) && 'grayscale',
            value !== true && '-translate-x-1/2 opacity-0',
          )}
        />
      </span>
      {trueLabel && (
        <span
          className={clsx(
            'transition-all',
            (value !== true || loading || disabled) && 'opacity-50',
          )}
        >
          {trueLabel}
        </span>
      )}
    </div>
  );
};
