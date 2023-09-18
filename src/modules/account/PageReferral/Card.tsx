import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';

export interface CardProps {
  className?: string;
  variant?: 'outline';
}

export default function Card(props: PropsWithChildren<CardProps>) {
  return (
    <div
      className={clsx(
        props.className,
        'rounded-3xl bg-white/5 p-8',
        props.variant === 'outline' && 'border-2',
      )}
    >
      {props.children}
    </div>
  );
}
