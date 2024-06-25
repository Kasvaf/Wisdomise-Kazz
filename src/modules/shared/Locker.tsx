import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

interface Props {
  overlay?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const Locker: React.FC<PropsWithChildren<Props>> = ({
  children,
  overlay,
  className,
  containerClassName,
}) => {
  if (!overlay) return <>{children}</>;

  return (
    <div className={clsx('relative', containerClassName)}>
      <div className="overflow-hidden rounded-xl">{children}</div>
      <div
        className={clsx(
          'absolute inset-0',
          'flex flex-col items-center overflow-hidden rounded-xl',
          'bg-page/60 backdrop-blur-[2px]',
          className,
        )}
      >
        {overlay}
      </div>
    </div>
  );
};

export default Locker;
