import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import type { To } from 'react-router';
import Spin from './Spin';

interface Props extends PropsWithChildren {
  to?: To;
  size?: 'small' | 'large' | 'manual';
  loading?: boolean;
  variant?:
    | 'primary'
    | 'primary-purple'
    | 'alternative'
    | 'secondary'
    | 'link'
    | 'green'
    | 'purple'
    | 'secondary-red'
    | 'brand';
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<unknown>;
  target?: string;
}

const LinkOrButton: React.FC<Props> = ({ to, children, ...rest }) =>
  to ? (
    <Link to={to} {...rest}>
      {children}
    </Link>
  ) : (
    <button {...rest}>{children}</button>
  );

const Button: React.FC<Props> = ({
  size,
  variant,
  loading,
  children,
  className,
  contentClassName,
  disabled,
  onClick,
  ...restOfProps
}) => {
  const btnContent = (
    <div className={clsx('flex items-center justify-center', contentClassName)}>
      {loading && (
        <Spin className={clsx(variant === 'brand' && 'text-white', 'mr-2')} />
      )}
      {children}
    </div>
  );
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    ev => {
      if (!loading && !disabled) onClick?.(ev);
    },
    [loading, disabled, onClick],
  );

  const sharedClasses = clsx('text-center text-sm font-medium leading-none');
  const sizeClass = clsx(
    size === 'small'
      ? '!p-[10px_12px]'
      : size === 'large'
        ? '!px-9 !py-3 md:!px-16 md:!py-5 md:text-xl'
        : size === 'manual'
          ? ''
          : 'px-8 py-4',
  );

  if (variant === 'link') {
    return (
      <LinkOrButton
        className={clsx(
          sharedClasses,
          '!hover:text-info bg-transparent !text-white',
          disabled && 'cursor-not-allowed !text-white/40',
          loading && 'cursor-wait',
          sizeClass,
          className,
        )}
        disabled={disabled}
        onClick={clickHandler}
        {...restOfProps}
      >
        {btnContent}
      </LinkOrButton>
    );
  }

  if (variant === 'secondary') {
    return (
      <LinkOrButton
        className={clsx(
          sharedClasses,
          'rounded-xl border border-white bg-transparent !text-white hover:border-white/40',
          disabled &&
            'cursor-not-allowed !border-white/10 !bg-white/10 !text-white/10',
          sizeClass,
          loading && 'cursor-wait',
          className,
        )}
        disabled={disabled}
        onClick={clickHandler}
        {...restOfProps}
      >
        {btnContent}
      </LinkOrButton>
    );
  }

  if (variant === 'secondary-red') {
    return (
      <LinkOrButton
        className={clsx(
          sharedClasses,
          'rounded-xl border border-[#F14056] bg-transparent !text-[#F14056] hover:border-[#F14056]/40',
          disabled &&
            'cursor-not-allowed !border-[#F14056]/10 !bg-white/10 !text-[#F14056]/10',
          sizeClass,
          loading && 'cursor-wait !text-[#F14056]/50',
          className,
        )}
        disabled={disabled}
        onClick={clickHandler}
        {...restOfProps}
      >
        {btnContent}
      </LinkOrButton>
    );
  }

  if (variant === 'alternative') {
    return (
      <LinkOrButton
        className={clsx(
          sharedClasses,
          'rounded-xl bg-white/10 !text-white hover:bg-black/20 [&.active]:bg-black/30',
          disabled && 'cursor-not-allowed !bg-white/10 !text-white/10',
          sizeClass,
          loading && 'cursor-wait',
          className,
        )}
        disabled={disabled}
        onClick={clickHandler}
        {...restOfProps}
      >
        {btnContent}
      </LinkOrButton>
    );
  }

  if (variant === 'green') {
    return (
      <LinkOrButton
        className={clsx(
          sharedClasses,
          'rounded-xl bg-[#11C37E99] !text-white hover:bg-[#11C37E99]/80',
          disabled &&
            'cursor-not-allowed !border-[#11C37E99]/40 !bg-[#11C37E99]/10 !text-white/10',
          loading && 'cursor-wait !text-white/50',
          sizeClass,
          className,
        )}
        disabled={disabled}
        onClick={clickHandler}
        {...restOfProps}
      >
        {btnContent}
      </LinkOrButton>
    );
  }

  if (variant === 'primary-purple') {
    return (
      <LinkOrButton
        className={clsx(
          'rounded-xl bg-gradient-to-bl from-[#615298] from-15% to-[#42427B] to-75% text-sm font-medium leading-none !text-white hover:saturate-150',
          disabled &&
            'cursor-not-allowed !border-[#11C37E99]/40 !bg-neutral-700 bg-none !text-white/30',
          loading && 'cursor-wait !text-white/50',
          sizeClass,
          className,
        )}
        disabled={disabled}
        onClick={clickHandler}
        {...restOfProps}
      >
        {btnContent}
      </LinkOrButton>
    );
  }

  if (variant === 'purple') {
    return (
      <LinkOrButton
        className={clsx(
          sharedClasses,
          'rounded-xl bg-[linear-gradient(235deg,#615298_13.43%,#42427B_77.09%)] !text-white hover:saturate-150',
          disabled && 'cursor-not-allowed !text-white/10',
          loading && 'cursor-wait !text-white/50',
          sizeClass,
          className,
        )}
        disabled={disabled}
        onClick={clickHandler}
        {...restOfProps}
      >
        {btnContent}
      </LinkOrButton>
    );
  }

  if (variant === 'brand') {
    return (
      <LinkOrButton
        className={clsx(
          sharedClasses,
          'rounded-xl bg-v1-background-brand !text-white hover:brightness-90',
          disabled &&
            'cursor-not-allowed !border-white/40 !bg-white/10 !text-white/10',
          loading && 'cursor-wait',
          sizeClass,
          className,
        )}
        disabled={disabled}
        onClick={clickHandler}
        {...restOfProps}
      >
        {btnContent}
      </LinkOrButton>
    );
  }

  return (
    <LinkOrButton
      className={clsx(
        sharedClasses,
        'rounded-xl bg-white !text-black hover:bg-white/80',
        disabled &&
          'cursor-not-allowed !border-white/40 !bg-white/10 !text-white/10',
        loading && 'cursor-wait',
        sizeClass,
        className,
      )}
      disabled={disabled}
      onClick={clickHandler}
      {...restOfProps}
    >
      {btnContent}
    </LinkOrButton>
  );
};

export default Button;
