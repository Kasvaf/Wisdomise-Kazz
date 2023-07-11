import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const DropdownContainer: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={`mt-1 flex flex-col rounded-3xl bg-[#272A32] p-2 backdrop-blur-lg ${className} font-poppins`}
    >
      {children}
    </div>
  );
};
