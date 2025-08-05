import { type ReactNode } from 'react';
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
      open={open}
      onClose={onClose}
      mode="drawer"
      drawerConfig={{
        position: isMobile ? 'bottom' : 'end',
        closeButton: isMobile,
      }}
      className="w-[400px] mobile:w-full"
      contentClassName="mobile:p-3 p-4"
      surface={1}
    >
      {children}
    </Dialog>
  );
}
