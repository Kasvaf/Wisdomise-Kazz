import { clsx } from 'clsx';
import { type FC, type MouseEvent, type ReactNode, useState } from 'react';
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
      className={clsx(
        /* Size: height, padding, font-size, border-radius */
        size === '3xs' && 'h-5 rounded text-2xs',
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
          'border-v1-background-brand bg-v1-background-brand text-v1-content-primary-inverse enabled:active:bg-v1-background-brand-pressed enabled:hover:bg-v1-background-brand-hover',
        variant === 'secondary' &&
          'border-v1-background-secondary bg-v1-background-secondary text-v1-content-primary enabled:active:bg-v1-background-secondary-pressed enabled:hover:bg-v1-background-secondary-hover',
        variant === 'outline' &&
          'border-white/5 bg-(--ghost-color) text-v1-content-primary enabled:active:border-white/100 enabled:hover:border-white/50',
        variant === 'ghost' &&
          'border-transparent bg-(--ghost-color) text-v1-content-primary enabled:active:bg-(--ghost-color) enabled:hover:bg-(--ghost-hover-color)',
        variant === 'pro' &&
          'border-transparent bg-pro-gradient text-v1-content-primary-inverse enabled:active:brightness-125 enabled:hover:brightness-[1.15]',
        variant === 'wsdm' &&
          'border-transparent bg-brand-gradient text-v1-content-primary enabled:active:brightness-125 enabled:hover:brightness-[1.15]',
        variant === 'white' &&
          'border-white bg-white text-v1-content-primary-inverse enabled:active:bg-white/100 enabled:hover:bg-white/90',
        variant === 'link' &&
          'border-transparent text-v1-content-link enabled:active:text-v1-content-link-pressed enabled:hover:text-v1-content-link-hover',
        variant === 'negative' &&
          'border-v1-border-negative bg-v1-background-negative text-v1-content-primary-inverse enabled:hover:bg-v1-background-negative/90',
        variant === 'negative_outline' &&
          'border-v1-border-negative bg-transparent text-v1-content-negative enabled:active:bg-transparent enabled:hover:bg-v1-background-negative/15',
        variant === 'positive' &&
          'border-v1-border-positive bg-v1-background-positive text-v1-content-primary-inverse enabled:hover:bg-v1-background-positive',
        variant === 'positive_outline' &&
          'border-v1-border-positive bg-transparent text-v1-content-positive enabled:active:bg-transparent enabled:hover:bg-v1-background-positive/15',
        /* Loading */
        (loading || localLoading) && 'animate-pulse',
        /* Disabled */
        'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-none disabled:bg-white/5 disabled:text-white/50 disabled:grayscale',
        /* Shared */
        'outline-none enabled:focus-visible:border-v1-border-focus',
        'relative select-none border font-normal transition-all [&_svg]:size-5 [&_svg]:shrink-0',
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
      style={{
        ['--ghost-color' as never]: colors.current,
        ['--ghost-hover-color' as never]: colors.next,
      }}
      type={type}
    >
      {children}
    </button>
  );
};
