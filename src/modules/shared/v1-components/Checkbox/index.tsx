import { type FC, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { type Surface, useSurface } from 'utils/useSurface';
import { ReactComponent as CheckIcon } from './check.svg';
import { ReactComponent as UnCheckIcon } from './uncheck.svg';

export const Checkbox: FC<{
  value?: boolean;
  onChange?: (newVal: boolean) => void;
  size: 'lg' | 'md';
  label?: ReactNode;
  className?: string;
  block?: boolean;
  variant?: 'checkbox' | 'button';
  surface?: Surface;
}> = ({
  block,
  onChange,
  value,
  size,
  label,
  className,
  variant = 'checkbox',
  surface = 3,
}) => {
  const Component = value ? CheckIcon : UnCheckIcon;
  const colors = useSurface(surface);
  return (
    <div
      className={clsx(
        block ? 'flex' : 'inline-flex',
        'relative cursor-pointer flex-row items-center overflow-hidden',
        size === 'lg' ? 'gap-2 text-sm' : 'gap-1 text-xs',
        variant === 'button' && [
          'select-none rounded-md border p-2 transition-colors duration-75',
          size === 'lg' ? 'h-sm' : 'h-xs',
          value
            ? 'border-[--later] bg-[--next]'
            : 'border-transparent bg-[--current] text-v1-content-primary/80 hover:text-v1-content-primary',
        ],
        className,
      )}
      style={{
        ['--prev' as never]: colors.prev,
        ['--current' as never]: colors.current,
        ['--next' as never]: colors.next,
        ['--later' as never]: colors.later,
      }}
      tabIndex={typeof onChange === 'function' ? 0 : -1}
      onClick={() => onChange?.(!value)}
    >
      <Component
        className={clsx(
          variant === 'button' && 'hidden',
          size === 'lg' ? 'size-5' : 'size-4',
          'overflow-visible',
        )}
      />
      {label}
    </div>
  );
};
