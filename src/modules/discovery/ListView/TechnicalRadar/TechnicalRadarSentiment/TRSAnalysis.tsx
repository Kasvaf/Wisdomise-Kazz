import { type FC } from 'react';
import { clsx } from 'clsx';
import { ReactComponent as ShineStar } from './shine-star.svg';

export const TRSAnalysis: FC<{ value?: string | null; className?: string }> = ({
  value,
  className,
}) => {
  if (!value || typeof value !== 'string') return null;
  return (
    <div
      className={clsx(
        'flex items-center justify-start gap-2 rounded-lg bg-v1-surface-l4 p-3 text-xs',
        className,
      )}
    >
      <div className="flex size-6 shrink-0 items-center justify-center rounded bg-brand-gradient">
        <ShineStar />
      </div>
      <p>{value}</p>
    </div>
  );
};
