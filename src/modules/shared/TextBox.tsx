import { clsx } from 'clsx';
import { type ChangeEventHandler, type FC, useCallback } from 'react';

interface Props {
  type?: 'text' | 'number';
  value: string;
  onChange: (item: string) => void;
  disabled?: boolean;
  suffix?: string;
  className?: string;
}

const TextBox: FC<Props> = ({
  type = 'text',
  value,
  onChange,
  disabled = false,
  suffix,
  className,
}) => {
  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      onChange((e.target as HTMLInputElement).value);
    },
    [onChange],
  );

  return (
    <div className="relative">
      <input
        type={type}
        className={clsx(
          'flex h-12 w-full rounded-full',
          'items-center justify-between',
          'bg-black/40 pl-6 pr-2',
          !disabled && 'focus:bg-black/60',
          suffix && 'pr-[56px]',
          className,
        )}
        value={value}
        onChange={changeHandler}
        disabled={disabled}
      />
      <div className="pointer-events-none absolute right-0 top-0 flex h-full items-center pr-4">
        <span>{suffix}</span>
      </div>
    </div>
  );
};

export default TextBox;
