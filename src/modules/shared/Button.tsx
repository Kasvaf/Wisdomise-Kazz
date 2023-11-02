import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import type { To } from 'react-router';
import Spin from './Spin';

interface Props extends PropsWithChildren {
  to?: To;
  size?: 'small';
  loading?: boolean;
  variant?: 'primary' | 'alternative' | 'secondary' | 'link';
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

  if (variant === 'link') {
    return (
      <LinkOrButton
        className={clsx(
          'bg-transparent px-8 py-4 text-sm font-medium leading-none text-white hover:text-warning',
          disabled && 'cursor-not-allowed !text-white/40',
          loading && 'cursor-wait',
          size === 'small' && '!p-[10px_12px]',
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
          'rounded-[40px] border border-white bg-transparent px-8 py-4 text-sm font-medium leading-none text-white hover:border-white/40',
          disabled &&
            'cursor-not-allowed !border-white/10 !bg-white/10 text-white/10',
          size === 'small' && '!p-[10px_12px] ',
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

  if (variant === 'alternative') {
    return (
      <LinkOrButton
        className={clsx(
          'rounded-[40px] bg-white/10 px-8 py-4 text-sm font-medium leading-none text-white hover:bg-black/5',
          disabled && 'cursor-not-allowed !bg-white/10 text-white/10',
          size === 'small' && '!p-[10px_12px] ',
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

  return (
    <LinkOrButton
      className={clsx(
        'rounded-[40px] bg-white px-8 py-4 text-sm font-medium leading-none text-black hover:bg-white/80',
        disabled &&
          'cursor-not-allowed !border-white/40 !bg-white/10 text-white/10',
        loading && 'cursor-wait',
        size === 'small' && '!p-[10px_12px]',
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
