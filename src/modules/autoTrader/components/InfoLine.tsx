import { clsx } from 'clsx';
import { type ReactNode } from 'react';

const InfoLine: React.FC<
  React.PropsWithChildren<{
    label: string | ReactNode;
    className?: string;
  }>
> = ({ label, className, children }) => {
  return (
    <div className={clsx('flex justify-between', className)}>
      <div className="font-normal text-v1-content-secondary">{label}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

export default InfoLine;
