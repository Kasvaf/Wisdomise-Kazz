import { clsx } from 'clsx';
import { type ReactNode, type FC, type MouseEventHandler } from 'react';

export const Button: FC<{
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'pro'
    | 'wsdm'
    | 'white'
    | 'link'
    | 'negative';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({
  size = 'xl',
  variant = 'primary',
  children,
  className,
  disabled,
  loading,
  block,
  onClick,
}) => {
  return (
    <button
      className={clsx(
        /* Size: height, padding, font-size, border-radius */
        size === '2xs' && 'h-2xs rounded px-3 text-xs',
        size === 'xs' && 'h-xs rounded-md px-3 text-xs',
        size === 'sm' && 'h-sm rounded-lg px-3 text-xs',
        size === 'md' && 'h-md rounded-lg px-3 text-xs',
        size === 'lg' && 'h-lg rounded-[10px] px-4 text-xs',
        size === 'xl' && 'h-xl rounded-xl px-4 text-sm',
        size === '2xl' && 'h-2xl rounded-2xl px-5 text-sm',
        /* Variant: background-color, color, :hover, :active */
        variant === 'primary' &&
          'border-v1-background-brand bg-v1-background-brand text-v1-content-primary enabled:hover:bg-v1-background-brand-hover enabled:active:bg-v1-background-brand-pressed',
        variant === 'secondary' &&
          'border-v1-background-secondary bg-v1-background-secondary text-v1-content-primary enabled:hover:bg-v1-background-secondary-hover enabled:active:bg-v1-background-secondary-pressed',
        variant === 'outline' &&
          'border-white/5 bg-transparent text-v1-content-primary enabled:hover:border-white/50 enabled:active:border-white/100',
        ...(variant === 'ghost'
          ? [
              'border-transparent text-v1-content-primary enabled:hover:bg-white/5 enabled:active:bg-white/10',
              'bg-v1-surface-l-next',
            ]
          : []),
        variant === 'pro' &&
          'border-transparent bg-pro-gradient text-v1-content-primary-inverse enabled:hover:brightness-[1.15] enabled:active:brightness-125',
        variant === 'wsdm' &&
          'border-transparent bg-wsdm-gradient text-v1-content-primary enabled:hover:brightness-[1.15] enabled:active:brightness-125',
        variant === 'white' &&
          'border-white bg-white text-v1-content-primary-inverse enabled:hover:bg-white/90 enabled:active:bg-white/100',
        variant === 'link' &&
          'border-transparent text-v1-content-link enabled:hover:text-v1-content-link-hover enabled:active:text-v1-content-link-pressed',
        variant === 'negative' &&
          'border-v1-border-negative bg-transparent text-v1-content-negative enabled:hover:bg-v1-background-negative/15 enabled:active:bg-transparent',
        /* Loading */
        loading && 'animate-pulse',
        /* Disabled */
        'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-white/5 disabled:bg-none disabled:text-white/50 disabled:grayscale',
        /* Shared */
        'relative select-none border font-normal transition-all [&_svg]:size-5',
        block ? 'flex' : 'inline-flex',
        'items-center justify-center gap-1',
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
