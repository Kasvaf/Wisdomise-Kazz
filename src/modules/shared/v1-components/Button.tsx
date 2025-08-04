import { clsx } from 'clsx';
import { type ReactNode, type FC, useState, type MouseEvent } from 'react';
import { type Surface, useSurface } from 'utils/useSurface';

export type ButtonSize =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl';

export interface ButtonProps {
  size?: ButtonSize;
  fab?: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'pro'
    | 'wsdm'
    | 'white'
    | 'link'
    | 'negative'
    | 'negative_outline'
    | 'positive'
    | 'positive_outline';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => unknown | Promise<unknown>;
  surface?: Surface;
  type?: 'button' | 'submit';
}

export const Button: FC<ButtonProps> = ({
  size = 'xl',
  fab,
  variant = 'primary',
  children,
  className,
  disabled,
  loading,
  block,
  onClick,
  surface = 1,
  type,
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const colors = useSurface(surface);
  return (
    <button
      style={{
        ['--ghost-color' as never]: colors.current,
        ['--ghost-hover-color' as never]: colors.next,
      }}
      className={clsx(
        /* Size: height, padding, font-size, border-radius */
        size === '3xs' && 'h-5 rounded text-xxs',
        size === '3xs' && (fab ? 'w-5' : 'px-2'),
        size === '2xs' && 'h-2xs rounded text-xs',
        size === '2xs' && (fab ? 'w-2xs' : 'px-3'),
        size === 'xs' && 'h-xs rounded-md text-xs',
        size === 'xs' && (fab ? 'w-xs' : 'px-3'),
        size === 'sm' && 'h-sm rounded-lg text-xs',
        size === 'sm' && (fab ? 'w-sm' : 'px-3'),
        size === 'md' && 'h-md rounded-lg text-xs',
        size === 'md' && (fab ? 'w-md' : 'px-3'),
        size === 'lg' && 'h-lg rounded-[10px] text-xs',
        size === 'lg' && (fab ? 'w-lg' : 'px-4'),
        size === 'xl' && 'h-xl rounded-xl text-sm',
        size === 'xl' && (fab ? 'w-xl' : 'px-4'),
        size === '2xl' && 'h-2xl rounded-2xl text-sm',
        size === '2xl' && (fab ? 'w-2xl' : 'px-5'),
        /* Variant: background-color, color, :hover, :active */
        variant === 'primary' &&
          'border-v1-background-brand bg-v1-background-brand text-v1-content-primary-inverse enabled:hover:bg-v1-background-brand-hover enabled:active:bg-v1-background-brand-pressed',
        variant === 'secondary' &&
          'border-v1-background-secondary bg-v1-background-secondary text-v1-content-primary enabled:hover:bg-v1-background-secondary-hover enabled:active:bg-v1-background-secondary-pressed',
        variant === 'outline' &&
          'bg-(--ghost-color) text-v1-content-primary border-white/5 enabled:hover:border-white/50 enabled:active:border-white/100',
        variant === 'ghost' &&
          'bg-(--ghost-color) text-v1-content-primary enabled:hover:bg-(--ghost-hover-color) enabled:active:bg-(--ghost-color) border-transparent',
        variant === 'pro' &&
          'text-v1-content-primary-inverse border-transparent bg-pro-gradient enabled:hover:brightness-[1.15] enabled:active:brightness-125',
        variant === 'wsdm' &&
          'text-v1-content-primary border-transparent bg-brand-gradient enabled:hover:brightness-[1.15] enabled:active:brightness-125',
        variant === 'white' &&
          'text-v1-content-primary-inverse border-white bg-white enabled:hover:bg-white/90 enabled:active:bg-white/100',
        variant === 'link' &&
          'text-v1-content-link enabled:hover:text-v1-content-link-hover enabled:active:text-v1-content-link-pressed border-transparent',
        variant === 'negative' &&
          'border-v1-border-negative bg-v1-background-negative text-v1-content-primary-inverse enabled:hover:bg-v1-background-negative/90',
        variant === 'negative_outline' &&
          'border-v1-border-negative text-v1-content-negative enabled:hover:bg-v1-background-negative/15 bg-transparent enabled:active:bg-transparent',
        variant === 'positive' &&
          'border-v1-border-positive bg-v1-background-positive text-v1-content-primary-inverse enabled:hover:bg-v1-background-positive',
        variant === 'positive_outline' &&
          'border-v1-border-positive text-v1-content-positive enabled:hover:bg-v1-background-positive/15 bg-transparent enabled:active:bg-transparent',
        /* Loading */
        (loading || localLoading) && 'animate-pulse',
        /* Disabled */
        'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-white/5 disabled:bg-none disabled:text-white/50 disabled:grayscale',
        /* Shared */
        'enabled:focus-visible:border-v1-border-focus outline-none',
        '[&_svg]:size-5 relative select-none border font-normal transition-all [&_svg]:shrink-0',
        block ? 'flex' : 'inline-flex',
        'items-center justify-center gap-1',
        className,
      )}
      disabled={disabled || loading || localLoading}
      onClick={e => {
        const ret = onClick?.(e);
        if (ret && ret instanceof Promise) {
          setLocalLoading(true);
          return ret.finally(() => {
            setLocalLoading(false);
          });
        }
        return ret;
      }}
      type={type}
    >
      {children}
    </button>
  );
};
