import { clsx } from 'clsx';
import { type ReactNode } from 'react';

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
    disabled?: boolean;
  }>;
  value?: T;
  onChange?: (newValue: T) => void;
}) {
  return (
    <div
      className={clsx(
        'inline-flex max-w-full items-center justify-start gap-1 overflow-auto',
        'h-12 whitespace-nowrap rounded-xl bg-black/40 p-1 text-white',
        className,
      )}
    >
      {options.map((option, index) => (
        <button
          onClick={() => onChange?.(option.value)}
          key={`${option.value?.toString() || ''}-${index}`}
          role="radio"
          aria-checked={value === option.value}
          disabled={option.disabled}
          className={clsx(
            'h-full rounded-lg px-3 text-sm text-white/60',
            'grow transition-colors duration-150',
            'enabled:hover:bg-white/5',
            'aria-checked:text-white enabled:aria-checked:bg-white/10',
            'disabled:opacity-40',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
