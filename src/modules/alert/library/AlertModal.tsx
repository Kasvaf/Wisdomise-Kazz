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
      className="mobile:w-full w-[400px]"
      contentClassName="mobile:p-3 p-4"
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
