import { clsx } from 'clsx';
import { bxQuestionMark } from 'boxicons-quasar';
import { useState } from 'react';
import { Modal } from 'antd';
import FabButton from './FabButton';

interface Props {
  title?: string;
  text: string;
  className?: string;
  size?: number;
}

const InfoButton: React.FC<Props> = ({ title, text, size = 12, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Modal
        centered
        footer={false}
        closeIcon={null}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
      >
        {title && <div className="mb-4">{title}</div>}
        <div className="flex items-center text-white/70">{text}</div>
      </Modal>
      <FabButton
        className={clsx('opacity-70', className)}
        size={size}
        icon={bxQuestionMark}
        onClick={() => setIsOpen(true)}
      />
    </>
  );
};

export default InfoButton;
