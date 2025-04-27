import { type ReactNode, type RefObject } from 'react';
import { Modal } from 'antd';
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
    <Modal
      centered
      open={open}
      onCancel={onClose}
      maskClosable={true}
      footer={false}
      rootClassName="[&_.ant-modal-content]:!bg-transparent [&_.ant-modal-content]:!px-0"
      className="[&>.ant-drawer-wrapper-body]:!bg-transparent"
    >
      <div className="mb-40 overflow-auto pt-8">{children}</div>

      <div className="fixed bottom-4 rounded-2xl bg-v1-surface-l2 px-3 py-5 mobile:inset-x-4 md:w-[520px]">
        <ReferralShareLinks
          screenshotTarget={screenshotTarget}
          fileName={fileName}
        />
      </div>
    </Modal>
  );
}
