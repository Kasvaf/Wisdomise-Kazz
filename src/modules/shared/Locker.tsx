import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

interface Props {
  overlay?: React.ReactNode;
}

const Locker: React.FC<PropsWithChildren<Props>> = ({ children, overlay }) => {
  if (!overlay) return <>{children}</>;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl">{children}</div>
      <div
        className={clsx(
          'absolute inset-0',
          'flex flex-col items-center overflow-hidden rounded-3xl',
          'bg-page/60 backdrop-blur-[2px]',
        )}
      >
        {overlay}
      </div>
    </div>
  );
};

export default Locker;
