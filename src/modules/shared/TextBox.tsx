import { clsx } from 'clsx';
import { type ChangeEventHandler, type FC, useCallback } from 'react';

interface Props {
  type?: 'text' | 'number' | 'tel';
  value: string;
  hasError?: boolean;
  filter?: (v: string) => string;
  onChange?: (item: string) => void;
  disabled?: boolean;
  suffix?: string;
  className?: string;
}

const TextBox: FC<Props> = ({
  type = 'text',
  value,
  hasError = false,
  filter = v => v,
  onChange,
  disabled = false,
  suffix,
  className,
}) => {
  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      const val = filter((e.target as HTMLInputElement).value);
      onChange?.(val);
      e.target.value = val;
    },
    [onChange, filter],
  );

  return (
    <div className="relative">
      <input
        type={type}
        className={clsx(
          'flex h-12 w-full rounded-full',
          'items-center justify-between',
          'border bg-black/40 pl-6 pr-2',
          hasError ? 'border-error text-error' : 'border-transparent',
          !disabled && 'focus:bg-black/60',
          suffix && 'pr-[56px]',
          className,
        )}
        value={value}
        onInput={changeHandler}
        disabled={disabled}
      />
      <div className="pointer-events-none absolute right-0 top-0 flex h-full items-center pr-4">
        <span>{suffix}</span>
      </div>
    </div>
  );
};

export default TextBox;
