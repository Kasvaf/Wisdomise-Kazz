import { clsx } from 'clsx';
import { type FC } from 'react';

export const Coin: FC<{
  icon: string;
  name: string;
  className?: string;
}> = ({ icon, name, className }) => (
  <span className={clsx('inline-flex items-center gap-2', className)}>
    <img src={icon} alt={name} className="size-7 rounded-full" />
    <span className="text-xs">{name}</span>
  </span>
);
