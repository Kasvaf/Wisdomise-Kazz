import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useState } from 'react';
import Icon from './Icon';
import { Dialog } from './v1-components/Dialog';

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
      <Dialog
        contentClassName="p-4 max-w-sm pe-8"
        footer={false}
        mode="modal"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        surface={2}
      >
        {title && <div className="mb-4">{title}</div>}
        <div className="flex items-center text-white/70">{text}</div>
      </Dialog>
      <Icon
        className={clsx(
          'block cursor-pointer text-base text-white/40 hover:text-white',
          className,
        )}
        name={bxInfoCircle}
        onClick={() => setIsOpen(true)}
        size={size}
      />
    </div>
  );
};

export default InfoButton;
