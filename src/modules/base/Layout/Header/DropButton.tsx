import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

interface Props {
  loading?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<any>;
}
const DropButton: React.FC<PropsWithChildren<Props>> = ({
  children,
  loading,
  className,
  onClick,
}) => {
  return (
    <button
      className={clsx(
        'flex items-center justify-center',
        'h-12 rounded-xl p-3 text-sm font-medium leading-none text-white ',
        'bg-white/5 hover:bg-black/20 [&.active]:bg-black/30',
        loading && 'cursor-wait',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DropButton;
