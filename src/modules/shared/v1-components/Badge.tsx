import { clsx } from 'clsx';
import type { FC, HTMLAttributes } from 'react';

export type BadgeColor =
  | 'brand'
  | 'secondary'
  | 'negative'
  | 'positive'
  | 'notice'
  | 'info'
  | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'soft' | 'outline';
  color?: BadgeColor;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: FC<BadgeProps> = ({
  dot,
  variant = dot ? 'solid' : 'soft',
  color = 'brand',
  size = 'sm',
  className,
  children,
  ...rest
}) => {
  return (
    <span
      className={clsx(
        dot
          ? '-right-1 -top-1 absolute size-2 rounded-full'
          : size === 'sm' && 'min-w-[16px] px-1.5 py-0.5 text-2xs',
        'inline-flex shrink-0 items-center rounded-full font-medium',
        '[&>svg]:-ml-1 [&>svg]:mr-1 [&>svg]:size-4',
        variant === 'solid' &&
          clsx(
            color === 'brand' &&
              'bg-v1-background-brand text-v1-content-primary-inverse',
            color === 'negative' &&
              'bg-v1-content-negative text-v1-content-primary',
            color === 'positive' &&
              'bg-v1-content-positive text-v1-content-primary',
            color === 'notice' &&
              'bg-v1-background-notice text-v1-content-primary-inverse',
            color === 'info' && 'bg-v1-background-info text-v1-content-primary',
            color === 'neutral' &&
              'bg-v1-background-primary text-v1-content-primary',
            color === 'secondary' &&
              'bg-v1-background-secondary text-v1-content-primary',
          ),
        variant === 'soft' &&
          clsx(
            color === 'brand' &&
              'bg-v1-background-brand/15 text-v1-content-brand',
            color === 'negative' &&
              'bg-v1-content-negative/15 text-v1-content-negative',
            color === 'positive' &&
              'bg-v1-content-positive/15 text-v1-content-positive',
            color === 'notice' &&
              'bg-v1-background-notice/15 text-v1-content-notice',
            color === 'info' && 'bg-v1-background-info/10 text-v1-content-info',
            color === 'neutral' && 'bg-white/10 text-v1-content-primary',
            color === 'secondary' &&
              'bg-v1-background-secondary/10 text-v1-background-secondary',
          ),
        variant === 'outline' &&
          clsx(
            'border border-v1-border-primary/10',
            color === 'brand' && 'text-v1-content-brand',
            color === 'negative' && 'text-v1-content-negative',
            color === 'positive' && 'text-v1-content-positive',
            color === 'notice' && 'text-v1-content-notice',
            color === 'info' && 'text-v1-content-info',
            color === 'neutral' && 'text-v1-content-primary/70',
            color === 'secondary' && 'text-v1-background-secondary',
          ),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
};
