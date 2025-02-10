import { type FC, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ReactComponent as CheckIcon } from './check.svg';
import { ReactComponent as UnCheckIcon } from './uncheck.svg';

export const Checkbox: FC<{
  value?: boolean;
  onChange?: (newVal: boolean) => void;
  size: 'lg' | 'md';
  label?: ReactNode;
  className?: string;
  block?: boolean;
}> = ({ block, onChange, value, size, label, className }) => {
  const Component = value ? CheckIcon : UnCheckIcon;
  return (
    <div
      className={clsx(
        block ? 'flex' : 'inline-flex',
        'cursor-pointer flex-row items-center',
        size === 'lg' ? 'gap-2 text-sm' : 'gap-1 text-xs',
        className,
      )}
      tabIndex={typeof onChange === 'function' ? 0 : -1}
      onClick={() => onChange?.(!value)}
    >
      <Component
        className={clsx(
          size === 'lg' ? 'size-5' : 'size-4',
          'overflow-visible',
        )}
      />
      {label}
    </div>
  );
};
