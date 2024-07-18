import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import Button from './Button';

export function ButtonSelect<T>({
  className,
  buttonClassName,
  options,
  value,
  onChange,
}: {
  className?: string;
  buttonClassName?: string;
  options: Array<{
    value: T;
    label: ReactNode;
    disabled?: boolean;
  }>;
  value?: T;
  onChange?: (newValue: T) => void;
}) {
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-start gap-2 overflow-auto',
        className,
      )}
    >
      {options.map((option, index) => (
        <Button
          onClick={() => onChange?.(option.value)}
          key={`${option.value?.toString() || ''}-${index}`}
          size="manual"
          variant="alternative"
          disabled={option.disabled}
          className={clsx(
            buttonClassName || 'h-6 px-3 text-xs mobile:px-2 mobile:text-xxs',
            value === option.value ? '!bg-white !text-black' : '',
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
