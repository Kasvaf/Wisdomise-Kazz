import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

export interface CardProps {
  className?: string;
  variant?: 'outline';
}

export default function Card({
  className,
  variant,
  children,
}: PropsWithChildren<CardProps>) {
  return (
    <div
      className={clsx(
        'rounded-3xl bg-white/5 p-8',
        variant === 'outline' && 'border-2',
        className,
      )}
    >
      {children}
    </div>
  );
}
