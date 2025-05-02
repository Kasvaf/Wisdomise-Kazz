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
      mode={isMobile ? 'bottomsheet' : 'end-drawer'}
      className="w-full max-w-lg p-6 mobile:max-w-full"
      surface={4}
    >
      {children}
    </Dialog>
  );
}
