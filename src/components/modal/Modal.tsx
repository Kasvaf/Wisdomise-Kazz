import type { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ModalInterface {
  children: ReactNode;
  className?: string;
  backdropClassName?: string;
  onClose?: () => void;
}

const Modal: FC<ModalInterface> = ({ children, className, onClose, backdropClassName }) => {
  return (
    <div
      className={twMerge(
        "fixed left-1/2 top-0 z-[100] flex h-screen w-full -translate-x-1/2 flex-col items-center justify-center bg-white/10",
        backdropClassName
      )}
      onClick={() => {
        onClose && onClose();
      }}
    >
      <div
        className={twMerge("mx-auto w-[355px] bg-black px-3 py-5 shadow-[0px_0px_20px_2px_#222]", className)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
