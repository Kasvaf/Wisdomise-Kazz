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
      className={clsx(
        'mt-1 flex flex-col rounded-xl bg-[#151619] p-2 backdrop-blur-lg',
        className,
      )}
      onClick={useCallback(() => setOpen?.(false), [setOpen])}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default DropdownContainer;
