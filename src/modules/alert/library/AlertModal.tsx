import { type ReactNode } from 'react';
import { DrawerModal } from 'shared/DrawerModal';

export function AlertModal({
  open,
  onClose,
  children,
}: {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}) {
  return (
    <DrawerModal
      open={open}
      onClose={onClose}
      destroyOnClose
      className="max-w-lg mobile:!h-[85svh] mobile:max-w-full"
      closable={false}
    >
      {children}
    </DrawerModal>
  );
}
