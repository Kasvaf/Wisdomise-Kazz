import { clsx } from 'clsx';
import { Spin } from 'antd';

const FiringHolder: React.FC<{ className?: string; firing?: boolean }> = ({
  firing,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-2 text-sm',
        'absolute inset-0 rounded-sm',
        className,
      )}
    >
      <Spin size="small" />
      {firing
        ? 'Sending your request...'
        : 'Confirming transaction on network...'}
    </div>
  );
};

export default FiringHolder;
