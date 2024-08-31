import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

const ResponsiveLabelInfo: React.FC<
  PropsWithChildren<{
    label: string;
    className?: string;
    labelClassName?: string;
  }>
> = ({ label, children, className, labelClassName }) => {
  return (
    <div
      className={clsx(
        'items-center justify-between text-xs text-white mobile:flex',
        className,
      )}
    >
      <div className={clsx('text-white/70', labelClassName)}>{label}</div>
      <div className="mt-4 flex mobile:mt-0">{children}</div>
    </div>
  );
};

export default ResponsiveLabelInfo;
