import { clsx } from 'clsx';
import { type CSSProperties, type PropsWithChildren } from 'react';
import { isMiniApp } from 'utils/version';

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
        'rounded-xl bg-black/20 p-2 md:rounded-3xl md:p-6',
        isMiniApp && 'bg-[#1D262F]',
        variant === 'outline' && 'border-2',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
