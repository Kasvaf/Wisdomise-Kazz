import { clsx } from 'clsx';
import { useState } from 'react';
import { Modal } from 'antd';
import { bxX } from 'boxicons-quasar';
import Icon from 'shared/Icon';
import { type SocialMessage } from 'api';
import { useSocialMessage } from './useSocialMessage';

export function SocialMessageImage({
  message,
  className,
}: {
  message: SocialMessage;
  className?: string;
}) {
  const [isExpand, setIsExpand] = useState(false);
  const { image: src } = useSocialMessage(message);

  if (!src) return null;

  return (
    <>
      <img
        src={src}
        className={clsx('cursor-pointer object-contain', className)}
        tabIndex={-1}
        onClick={() => setIsExpand(p => !p)}
      />
      <Modal
        open={isExpand}
        onCancel={() => setIsExpand(false)}
        destroyOnClose
        closable
        footer={false}
        centered
        width={960}
        className="[&_.ant-modal-content]:!p-0"
        closeIcon={
          <Icon name={bxX} className="rounded-full bg-white/50 text-black/60" />
        }
      >
        <img src={src} className="size-full object-contain" />
      </Modal>
    </>
  );
}
