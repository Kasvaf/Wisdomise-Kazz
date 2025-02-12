import { clsx } from 'clsx';
import {
  type ChangeEventHandler,
  useCallback,
  type ReactNode,
  useRef,
} from 'react';
import { type Surface, useSurface } from 'utils/useSurface';

export function Input<T extends 'number' | 'string'>({
  size = 'xl',
  value,
  onChange,
  type,
  disabled,
  loading,
  block,
  placeholder,
  className,
  prefixIcon,
  suffixIcon,
  surface = 3,
}: {
  size?: 'xs' | 'sm' | 'md' | 'xl';

  type?: T;

  value?: T extends 'number' ? number : string;
  onChange?: (
    newValue: T extends 'number' ? number | undefined : string,
  ) => void;

  disabled?: boolean;
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
        onChange?.((+e.target.value || undefined) as never);
      } else {
        onChange?.((e.target.value ?? '') as never);
      }
    },
    [onChange, type],
  );
  return (
    <div
      className={clsx(
        /* Size: height, padding, font-size, border-radius */
        size === 'xs' && 'h-xs rounded-md px-3 text-xs',
        size === 'sm' && 'h-sm rounded-lg px-3 text-xs',
        size === 'md' && 'h-md rounded-lg px-3 text-xs',
        size === 'xl' && 'h-xl rounded-xl px-4 text-sm',
        /* Loading */
        loading && 'animate-pulse',
        /* Disabled */
        'aria-disabled::cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-white/5 aria-disabled:bg-none aria-disabled:text-white/50 aria-disabled:grayscale',
        /* Shared */
        'border border-transparent font-normal transition-all focus-within:border-v1-border-focus [&_svg]:size-5',
        block ? 'flex' : 'inline-flex',
        'items-center justify-between gap-1',
        className,
      )}
      style={{
        backgroundColor: colors.current,
      }}
      aria-disabled={disabled}
      onClick={() => inputRef.current?.focus()}
    >
      {prefixIcon}
      <input
        className="block w-full grow border-0 bg-transparent text-inherit outline-none"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        ref={inputRef}
        type={type === 'number' ? 'number' : 'text'}
      />
      {suffixIcon}
    </div>
  );
}
