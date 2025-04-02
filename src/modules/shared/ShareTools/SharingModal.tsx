import { type ReactNode, type RefObject } from 'react';
import { Modal } from 'antd';
import { ShareLinks } from './ShareLinks';

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
    <Modal
      centered
      open={open}
      onCancel={onClose}
      maskClosable={true}
      footer={false}
      rootClassName="[&_.ant-modal-content]:!bg-transparent [&_.ant-modal-content]:!px-0"
      className="[&>.ant-drawer-wrapper-body]:!bg-transparent"
    >
      <div className="pt-8">{children}</div>

      <div className="rounded-2xl bg-v1-surface-l1 px-3 py-5">
        <ShareLinks screenshotTarget={screenshotTarget} fileName={fileName} />
      </div>
    </Modal>
  );
}
