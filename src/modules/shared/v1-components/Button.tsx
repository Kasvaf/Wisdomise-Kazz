import { clsx } from 'clsx';
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useState,
} from 'react';
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

type ButtonAs = 'button' | 'a';
type ButtonProps<T extends ButtonAs> = {
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
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
  ) => unknown | Promise<unknown>;
  surface?: Surface;
  as?: T;
} & (T extends 'button'
  ? ButtonHTMLAttributes<HTMLButtonElement>
  : AnchorHTMLAttributes<HTMLAnchorElement>);

export const Button = <T extends ButtonAs = 'button'>({
  size = 'xl',
  fab,
  variant = 'primary',
  className,
  disabled,
  loading,
  block,
  onClick,
  surface = 1,
  type,
  as,
  children,
  ...props
}: ButtonProps<T>) => {
  const [localLoading, setLocalLoading] = useState(false);
  const colors = useSurface(surface);
  const RootComponent = as || ('button' as any);

  return (
    <RootComponent
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
          'border-v1-background-brand bg-v1-background-brand text-v1-content-primary-inverse [&:not([disabled])]:hover:bg-v1-background-brand-hover [&:not([disabled])]:active:bg-v1-background-brand-pressed',
        variant === 'secondary' &&
          'border-v1-background-secondary bg-v1-background-secondary text-v1-content-primary [&:not([disabled])]:hover:bg-v1-background-secondary-hover [&:not([disabled])]:active:bg-v1-background-secondary-pressed',
        variant === 'outline' &&
          'border-white/5 bg-(--ghost-color) text-v1-content-primary [&:not([disabled])]:hover:border-white/50 [&:not([disabled])]:active:border-white/100',
        variant === 'ghost' &&
          'border-transparent bg-(--ghost-color) text-v1-content-primary [&:not([disabled])]:hover:bg-(--ghost-hover-color) [&:not([disabled])]:active:bg-(--ghost-color)',
        variant === 'pro' &&
          'border-transparent bg-pro-gradient text-v1-content-primary-inverse [&:not([disabled])]:hover:brightness-[1.15] [&:not([disabled])]:active:brightness-125',
        variant === 'wsdm' &&
          'border-transparent bg-brand-gradient text-v1-content-primary [&:not([disabled])]:hover:brightness-[1.15] [&:not([disabled])]:active:brightness-125',
        variant === 'white' &&
          'border-white bg-white text-v1-content-primary-inverse [&:not([disabled])]:hover:bg-white/90 [&:not([disabled])]:active:bg-white/100',
        variant === 'link' &&
          'border-transparent text-v1-content-link [&:not([disabled])]:hover:text-v1-content-link-hover [&:not([disabled])]:active:text-v1-content-link-pressed',
        variant === 'negative' &&
          'border-v1-border-negative bg-v1-background-negative text-v1-content-primary-inverse [&:not([disabled])]:hover:bg-v1-background-negative/90',
        variant === 'negative_outline' &&
          'border-v1-border-negative bg-transparent text-v1-content-negative [&:not([disabled])]:hover:bg-v1-background-negative/15 [&:not([disabled])]:active:bg-transparent',
        variant === 'positive' &&
          'border-v1-border-positive bg-v1-background-positive text-v1-content-primary-inverse [&:not([disabled])]:hover:bg-v1-background-positive',
        variant === 'positive_outline' &&
          'border-v1-border-positive bg-transparent text-v1-content-positive [&:not([disabled])]:hover:bg-v1-background-positive/15 [&:not([disabled])]:active:bg-transparent',
        /* Loading */
        (loading || localLoading) && 'animate-pulse',
        /* Disabled */
        'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-none disabled:bg-white/5 disabled:text-white/50 disabled:grayscale',
        /* Shared */
        'outline-none [&:not([disabled])]:focus-visible:border-v1-border-focus',
        'relative select-none border font-normal transition-all [&_svg]:size-5 [&_svg]:shrink-0',
        block ? 'flex' : 'inline-flex',
        'items-center justify-center gap-1',
        className,
      )}
      disabled={disabled || loading || localLoading}
      onClick={(e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
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
      {...props}
    >
      {children}
    </RootComponent>
  );
};
