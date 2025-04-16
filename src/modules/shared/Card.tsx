import { clsx } from 'clsx';
import { type CSSProperties, type PropsWithChildren } from 'react';

interface CardProps {
  className?: string;
  style?: CSSProperties;
  variant?: 'outline';
}

export default function Card({
  className,
  style,
  variant,
  children,
}: PropsWithChildren<CardProps>) {
  return (
    <div
      className={clsx(
        'rounded-xl bg-v1-surface-l3 p-6',
        variant === 'outline' && 'border-2',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
