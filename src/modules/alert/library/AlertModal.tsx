import type { ReactNode } from 'react';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';

export function AlertModal({
  open,
  onClose,
  children,
}: {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}) {
  const isMobile = useIsMobile();
  return (
    <Dialog
      className="w-[400px] max-md:w-full"
      contentClassName="max-md:p-3 p-4"
      drawerConfig={{
        position: isMobile ? 'bottom' : 'end',
        closeButton: isMobile,
      }}
      mode="drawer"
      onClose={onClose}
      open={open}
      surface={1}
    >
      {children}
    </Dialog>
  );
}
