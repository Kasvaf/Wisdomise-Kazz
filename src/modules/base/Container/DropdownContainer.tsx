import { clsx } from 'clsx';
import type React from 'react';
import { forwardRef, useCallback } from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
  setOpen?: (val: boolean) => unknown;
}

const DropdownContainer: React.FC<Props> = forwardRef<
  HTMLDivElement | null,
  Props
>(function DropdownContainer({ children, className, setOpen }, ref) {
  return (
    <div
      ref={ref}
      className={clsx(
        'mt-1 flex flex-col rounded-3xl bg-[#272A32] p-2 font-poppins backdrop-blur-lg',
        className,
      )}
      onClick={useCallback(() => setOpen?.(false), [setOpen])}
    >
      {children}
    </div>
  );
});

export default DropdownContainer;
