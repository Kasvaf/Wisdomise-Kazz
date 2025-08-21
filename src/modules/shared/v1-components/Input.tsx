import { clsx } from 'clsx';
import type React from 'react';
import {
  type ChangeEventHandler,
  type ReactNode,
  useCallback,
  useRef,
} from 'react';
import { type Surface, useSurface } from 'utils/useSurface';

export function Input<T extends 'number' | 'string'>({
  size = 'xl',
  value,
  onChange,
  onKeyDown,
  onBlur,
  type,
  min,
  max,
  disabled,
  readOnly,
  pattern,
  loading,
  block,
  placeholder,
  className,
  prefixIcon,
  suffixIcon,
  surface = 2,
}: {
  size?: 'xs' | 'sm' | 'md' | 'xl';

  type?: T;
  min?: number;
  max?: number;
  value?: T extends 'number' ? number : string;
  onChange?: (
    newValue: T extends 'number' ? number | undefined : string,
  ) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  disabled?: boolean;
  readOnly?: boolean;
  pattern?: string;
  loading?: boolean;
  block?: boolean;
  placeholder?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;
  surface?: Surface;
}) {
  const colors = useSurface(surface);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (type === 'number') {
        let newValue = +e.target.value || undefined;
        if (typeof newValue === 'number') {
          if (typeof min === 'number') {
            newValue = newValue < min ? min : newValue;
          }
          if (typeof max === 'number') {
            newValue = newValue > max ? max : newValue;
          }
        }
        onChange?.(newValue as never);
      } else {
        onChange?.((e.target.value ?? '') as never);
      }
    },
    [max, min, onChange, type],
  );
  return (
    <div
      aria-disabled={disabled}
      className={clsx(
        /* Size: height, padding, font-size, border-radius */
        size === 'xs' && 'h-xs rounded-md px-3 text-xs',
        size === 'sm' && 'h-sm rounded-lg px-3 text-xs',
        size === 'md' && 'h-md rounded-lg px-3 text-xs',
        size === 'xl' && 'h-xl rounded-xl px-4 text-sm',
        /* Loading */
        loading && 'animate-pulse',
        /* Disabled */
        'aria-disabled::cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-none aria-disabled:bg-white/5 aria-disabled:text-white/50 aria-disabled:grayscale',
        /* Shared */
        'border border-transparent font-normal transition-all focus-within:border-v1-border-focus [&_svg]:size-5',
        block ? 'flex' : 'inline-flex',
        'items-center justify-between gap-1',
        className,
      )}
      onClick={() => inputRef.current?.focus()}
      style={{
        backgroundColor: colors.current,
      }}
    >
      {prefixIcon}
      <input
        className="block w-full grow border-0 bg-transparent text-inherit outline-none"
        disabled={disabled}
        max={max}
        min={min}
        onBlur={onBlur}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        pattern={pattern}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={inputRef}
        type={type === 'number' ? 'number' : 'text'}
        value={value === undefined ? '' : value}
      />
      {suffixIcon}
    </div>
  );
}
