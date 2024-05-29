import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import { useState } from 'react';
import { Modal } from 'antd';
import Icon from './Icon';

interface Props {
  title?: string;
  text: string;
  className?: string;
  size?: number;
}

const InfoButton: React.FC<Props> = ({ title, text, size = 24, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
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
      <Icon
        name={bxInfoCircle}
        className={clsx(
          'block cursor-pointer text-base text-white/40 hover:text-white',
          className,
        )}
        onClick={() => setIsOpen(true)}
        size={size}
      />
    </div>
  );
};

export default InfoButton;
