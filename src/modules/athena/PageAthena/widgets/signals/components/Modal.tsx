import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { ReactComponent as CloseIcon } from '../icons/close.svg';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Modal: React.FC<PropsWithChildren<Props>> = ({
  children,
  open,
  onClose,
}) => {
  const container = document.querySelector('#signals-widget-wrapper');
  if (!open || !container) return null;

  return createPortal(
    <div
      className={clsx(
        'absolute left-1/2 top-[60px] z-10 hidden h-[80%] w-[90%] -translate-x-1/2  rounded-2xl bg-[#3F3F3F]',
        open && '!block',
      )}
    >
      <CloseIcon
        className="absolute right-4 top-4 cursor-pointer"
        onClick={onClose}
      />
      {children}
    </div>,
    container,
  );
};
