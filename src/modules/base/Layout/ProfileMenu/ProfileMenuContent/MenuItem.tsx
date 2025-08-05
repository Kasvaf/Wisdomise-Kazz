import { clsx } from 'clsx';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { type MouseEventHandler, type PropsWithChildren } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from 'shared/Icon';
import { useHasFlag } from 'api';

const MenuItem: React.FC<
  PropsWithChildren<{
    to?: string;
    href?: string;
    className?: string;
    onClick?: MouseEventHandler<any>;
    noArrow?: boolean;
  }>
> = ({ className, children, to, href, noArrow, ...props }) => {
  const { pathname } = useLocation();
  const classes = clsx(
    'cursor-pointer bg-v1-surface-l3 !text-v1-content-primary hover:bg-v1-surface-l2',
    'flex h-12 items-center justify-between py-2 pl-3 pr-4',
    'select-none rounded-xl',
    to && pathname.startsWith(to) && '!bg-v1-surface-l2',
    className,
  );
  const hasFlag = useHasFlag();

  const content = (
    <>
      <div className="flex items-center gap-2">{children}</div>
      {!noArrow && <Icon name={bxRightArrowAlt} />}
    </>
  );

  if (to && !hasFlag(to)) return null;

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
