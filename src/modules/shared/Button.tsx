import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import type { To } from 'react-router';
import Spin from './Spin';

interface Props extends PropsWithChildren {
  to?: To;
  size?: 'small' | 'large';
  loading?: boolean;
  variant?:
    | 'primary'
    | 'alternative'
    | 'secondary'
    | 'link'
    | 'green'
    | 'purple'
    | 'secondary-red';
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<any>;
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
      {loading && <Spin className="mr-2" />}
      {children}
    </div>
  );
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    ev => {
      if (!loading && !disabled) onClick?.(ev);
    },
    [loading, disabled, onClick],
  );

  const sharedClasses = 'text-sm font-medium leading-none';
  const sizeClass =
    size === 'small'
      ? '!p-[10px_12px]'
      : size === 'large'
      ? '!px-9 !py-3 md:!px-16 md:!py-5 md:text-xl'
      : '';

  if (variant === 'link') {
    return (
      <LinkOrButton
        className={clsx(
          sharedClasses,
          'bg-transparent px-8 py-4 text-white hover:text-warning',
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
          'rounded-xl border border-white bg-transparent px-8 py-4 text-white hover:border-white/40',
          disabled &&
            'cursor-not-allowed !border-white/10 !bg-white/10 text-white/10',
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
          'rounded-xl border border-[#F14056] bg-transparent px-8 py-4 text-[#F14056] hover:border-[#F14056]/40',
          disabled &&
            'cursor-not-allowed !border-[#F14056]/10 !bg-white/10 text-[#F14056]/10',
          sizeClass,
          loading && 'cursor-wait text-[#F14056]/50',
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
          'rounded-xl bg-white/10 px-8 py-4 text-white hover:bg-black/20 [&.active]:bg-black/30',
          disabled && 'cursor-not-allowed !bg-white/10 text-white/10',
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
          'rounded-xl bg-[#11C37E99] px-8 py-4 text-white hover:bg-[#11C37E99]/80',
          disabled &&
            'cursor-not-allowed !border-[#11C37E99]/40 !bg-[#11C37E99]/10 text-white/10',
          loading && 'cursor-wait text-white/50',
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
          'rounded-xl bg-[linear-gradient(235deg,#615298_13.43%,#42427B_77.09%)] px-8 py-4 !text-white hover:saturate-200',
          disabled && 'cursor-not-allowed text-white/10',
          loading && 'cursor-wait text-white/50',
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
        'rounded-xl bg-white px-8 py-4 text-black hover:bg-white/80',
        disabled &&
          'cursor-not-allowed !border-white/40 !bg-white/10 text-white/10',
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
