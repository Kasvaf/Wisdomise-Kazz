import { type ReactNode, type RefObject } from 'react';
import { Dialog } from 'shared/v1-components/Dialog';
import { ReferralShareLinks } from './ReferralShareLinks';

export default function SharingModal({
  open,
  onClose,
  children,
  fileName,
  screenshotTarget,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  fileName: string;
  screenshotTarget: RefObject<HTMLElement>;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      mode="modal"
      className="w-max !bg-transparent"
      footer={
        <ReferralShareLinks
          screenshotTarget={screenshotTarget}
          fileName={fileName}
        />
      }
    >
      {children}
    </Dialog>
  );
}
