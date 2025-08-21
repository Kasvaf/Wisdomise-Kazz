import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import InfoButton from 'shared/InfoButton';

const InfoLine: React.FC<
  React.PropsWithChildren<{
    label: string | ReactNode;
    info?: string;
    className?: string;
  }>
> = ({ label, info, className, children }) => {
  const lbl =
    info && typeof label === 'string' ? (
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <InfoButton size={16} text={info} title={label} />
      </div>
    ) : (
      label
    );

  return (
    <div className={clsx('flex justify-between', className)}>
      <div className="font-normal text-v1-content-secondary">{lbl}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

export default InfoLine;
