import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren, useCallback } from 'react';
import type { To } from 'react-router';
import { Link } from 'react-router-dom';
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
          '!text-white bg-transparent !hover:text-info',
          disabled && '!text-white/40 cursor-not-allowed',
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
          '!text-white rounded-xl border border-white bg-transparent hover:border-white/40',
          disabled &&
            '!border-white/10 !bg-white/10 !text-white/10 cursor-not-allowed',
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
          '!text-[#F14056] rounded-xl border border-[#F14056] bg-transparent hover:border-[#F14056]/40',
          disabled &&
            '!border-[#F14056]/10 !bg-white/10 !text-[#F14056]/10 cursor-not-allowed',
          sizeClass,
          loading && '!text-[#F14056]/50 cursor-wait',
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
          '!text-white rounded-xl bg-white/10 hover:bg-black/20 [&.active]:bg-black/30',
          disabled && '!bg-white/10 !text-white/10 cursor-not-allowed',
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
          '!text-white rounded-xl bg-[#11C37E99] hover:bg-[#11C37E99]/80',
          disabled &&
            '!border-[#11C37E99]/40 !bg-[#11C37E99]/10 !text-white/10 cursor-not-allowed',
          loading && '!text-white/50 cursor-wait',
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
          '!text-white rounded-xl bg-gradient-to-bl from-15% from-[#615298] to-75% to-[#42427B] font-medium text-sm leading-none hover:saturate-150',
          disabled &&
            '!border-[#11C37E99]/40 !bg-neutral-700 !text-white/30 cursor-not-allowed bg-none',
          loading && '!text-white/50 cursor-wait',
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
          '!text-white rounded-xl bg-[linear-gradient(235deg,#615298_13.43%,#42427B_77.09%)] hover:saturate-150',
          disabled && '!text-white/10 cursor-not-allowed',
          loading && '!text-white/50 cursor-wait',
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
          '!text-white rounded-xl bg-v1-background-brand hover:brightness-90',
          disabled &&
            '!border-white/40 !bg-white/10 !text-white/10 cursor-not-allowed',
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
        '!text-black rounded-xl bg-white hover:bg-white/80',
        disabled &&
          '!border-white/40 !bg-white/10 !text-white/10 cursor-not-allowed',
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
