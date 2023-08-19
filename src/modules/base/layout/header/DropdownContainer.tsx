import type React from 'react';
import { forwardRef } from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const DropdownContainer: React.FC<Props> = forwardRef<
  HTMLDivElement | null,
  Props
>(function DropdownContainer({ children, className }, ref) {
  return (
    <div
      ref={ref}
      className={`mt-1 flex flex-col rounded-3xl bg-[#272A32] p-2 backdrop-blur-lg ${className} font-poppins`}
    >
      {children}
    </div>
  );
});
