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
  type?: 'text' | 'number' | 'tel' | 'email';
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
    filter,
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
      let val = (e.target as HTMLInputElement).value;
      if (typeof filter === 'function') {
        val = filter(val);
      }
      onChange?.(val);
      if (e.target.value !== val) {
        e.target.value = val;
      }
    },
    [onChange, filter],
  );

  const hasErrorMessage = Boolean(error && typeof error === 'string');

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-2 block text-xs">{label}</label>}

      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={clsx(
            'id-input',
            'flex h-10 w-full rounded-lg',
            'items-center justify-between',
            'border bg-v1-surface-l3 pl-3 pr-2 outline-none',
            error ? 'border-error text-v1-content-negative' : 'border-transparent',
            disabled ? 'text-white/30' : '',
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
            !noSuffixPad && 'pr-4',
          )}
        >
          {isValidElement(suffix) ? suffix : <span>{suffix}</span>}
        </div>
      </div>

      {(hasErrorMessage || hint) && (
        <div className="ml-5 mt-2">
          {hasErrorMessage ? (
            <div className="text-xs text-v1-content-negative">{error}</div>
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
