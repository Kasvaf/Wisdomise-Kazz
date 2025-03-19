import { clsx } from 'clsx';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { type MouseEventHandler, type PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from 'shared/Icon';

const MenuItem: React.FC<
  PropsWithChildren<{
    to?: string;
    href?: string;
    className?: string;
    onClick?: MouseEventHandler<any>;
    noArrow?: boolean;
  }>
> = ({ className, children, to, href, noArrow, ...props }) => {
  const classes = clsx(
    'cursor-pointer bg-v1-surface-l3 !text-v1-content-primary hover:bg-v1-surface-l2',
    'flex h-12 items-center justify-between py-2 pl-3 pr-4',
    'select-none rounded-xl',
    className,
  );

  const content = (
    <>
      <div className="flex items-center gap-2">{children}</div>
      {!noArrow && <Icon name={bxRightArrowAlt} />}
    </>
  );

  return to ? (
    <NavLink {...props} to={to} className={classes}>
      {content}
    </NavLink>
  ) : href ? (
    <a {...props} className={classes} href={href}>
      {content}
    </a>
  ) : (
    <div {...props} className={classes}>
      {content}
    </div>
  );
};

export default MenuItem;
