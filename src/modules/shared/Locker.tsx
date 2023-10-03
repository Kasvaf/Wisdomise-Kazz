import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

interface Props {
  overlay?: React.ReactNode;
}

const Locker: React.FC<PropsWithChildren<Props>> = ({ children, overlay }) => {
  if (!overlay) return <>{children}</>;

  return (
    <div className="relative">
      <div className="">{children}</div>
      <div
        className={clsx(
          'absolute left-0 top-0 h-full w-full',
          'flex flex-col items-center overflow-hidden rounded-3xl',
          'bg-[#131822]/60 backdrop-blur-[2px]',
        )}
      >
        {overlay}
      </div>
    </div>
  );
};

export default Locker;
