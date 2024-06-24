import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import Button from './Button';

export function ButtonSelect<T>({
  className,
  options,
  value,
  onChange,
}: {
  className?: string;
  options: Array<{
    value: T;
    label: ReactNode;
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
      {options.map(option => (
        <Button
          onClick={() => onChange?.(option.value)}
          key={option.label?.toString()}
          size="manual"
          variant="alternative"
          className={clsx(
            'h-6 px-3 text-xs mobile:px-2 mobile:text-xxs',
            value === option.value ? '!bg-white !text-black' : '',
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
