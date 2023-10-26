import { clsx } from 'clsx';
import { type ChangeEventHandler, type FC, useCallback } from 'react';

interface Props {
  label?: string;
  value: string;
  hint?: string;
  suffix?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  inputClassName?: string;
  error?: string | boolean;
  type?: 'text' | 'number' | 'tel';
  filter?: (v: string) => string;
  onChange?: (item: string) => void;
}

const TextBox: FC<Props> = ({
  type = 'text',
  label,
  value,
  error,
  hint,
  filter = v => v,
  onChange,
  disabled = false,
  suffix,
  className,
  placeholder,
  inputClassName,
}) => {
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
      {label && <label className="mb-2 ml-4 block">{label}</label>}

      <div className="relative">
        <input
          type={type}
          className={clsx(
            'flex h-12 w-full rounded-full',
            'items-center justify-between',
            'border bg-black/40 pl-6 pr-2 outline-none',
            error ? 'border-error text-error' : 'border-transparent',
            !disabled && 'focus:bg-black/60',
            suffix && 'pr-[56px]',
            inputClassName,
          )}
          value={value}
          disabled={disabled}
          onInput={changeHandler}
          placeholder={placeholder}
        />
        <div className="pointer-events-none absolute right-0 top-0 flex h-full items-center pr-4">
          <span>{suffix}</span>
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
};

export default TextBox;
