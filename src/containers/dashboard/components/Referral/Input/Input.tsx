import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: string;
  inputClassName?: string;
}
//         <div className="h-12 w-full rounded p-4 text-sm font-medium text-white/60"></div>

const Input: FC<InputProps> = ({
  className,
  inputClassName,
  error,
  ...rest
}) => {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <input
        type="text"
        className={twMerge(
          'rounded bg-black p-4 text-white placeholder:text-white/60',
          inputClassName,
        )}
        {...rest}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
};

export default Input;
