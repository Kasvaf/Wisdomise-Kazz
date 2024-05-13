import { clsx } from 'clsx';
import type React from 'react';
import { forwardRef, isValidElement } from 'react';
import { type ChangeEventHandler, useCallback } from 'react';

interface Props {
  label?: string | React.ReactNode;
  value: string;
  hint?: string | React.ReactNode;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  inputClassName?: string;
  error?: string | boolean;
  type?: 'text' | 'number' | 'tel';
  filter?: (v: string) => string;
  suffix?: string | React.ReactNode;
  noSuffixPad?: boolean;
  onChange?: (item: string) => void;
  onKeyDown?: React.DOMAttributes<HTMLInputElement>['onKeyDown'];
}

const TextBox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    type = 'text',
    label,
    value,
    error,
    hint,
    filter = v => v,
    onChange,
    onBlur,
    disabled = false,
    suffix,
    noSuffixPad = false,
    onKeyDown,
    className,
    placeholder,
    inputClassName,
  } = props;
  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      const val = filter((e.target as HTMLInputElement).value);
      onChange?.(val);
      e.target.value = val;
    },
    [onChange, filter],
  );

  const hasErrorMessage = Boolean(error && typeof error === 'string');

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-2 block">{label}</label>}

      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={clsx(
            'flex h-12 w-full rounded-xl',
            'items-center justify-between',
            'border bg-black/40 pl-3 pr-2 outline-none',
            error ? 'border-error text-error' : 'border-transparent',
            disabled ? 'text-white/30' : 'focus:bg-black/60',
            suffix && 'pr-[56px]',
            inputClassName,
          )}
          value={value}
          onBlur={onBlur}
          disabled={disabled}
          onKeyDown={onKeyDown}
          onInput={changeHandler}
          placeholder={placeholder}
        />
        <div
          className={clsx(
            'absolute right-0 top-0 flex h-full items-center',
            !isValidElement(suffix) && 'pointer-events-none',
            disabled && 'text-white/30',
            !noSuffixPad && 'pr-4',
          )}
        >
          {isValidElement(suffix) ? suffix : <span>{suffix}</span>}
        </div>
      </div>

      {(hasErrorMessage || hint) && (
        <div className="ml-5 mt-2">
          {hasErrorMessage ? (
            <div className="text-xs text-error">{error}</div>
          ) : (
            Boolean(hint) && <div className="text-xs text-white/60">{hint}</div>
          )}
        </div>
      )}
    </div>
  );
});
TextBox.displayName = 'TextBox';
export default TextBox;
