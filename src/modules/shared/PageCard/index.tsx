import { clsx } from 'clsx';
import type { FC, MouseEventHandler, ReactNode, SVGProps } from 'react';
import { NavLink } from 'react-router-dom';
import { useHasFlag } from 'services/rest';
import { DebugPin } from 'shared/DebugPin';
import { ArrowIcon } from './icons';

interface PageCardProps {
  to: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  title: ReactNode;
  description: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  badge?: ReactNode;
  className?: string;
}

export const PageCard: FC<PageCardProps> = props => {
  const {
    to,
    title,
    icon: Icon,
    description,
    onClick,
    badge,
    className,
  } = props;
  const hasFlag = useHasFlag();

  if (!hasFlag(to)) return null;

  return (
    <NavLink
      className={clsx(
        className,
        'group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl',
        'h-20 bg-v1-surface-l2 px-3 transition-all duration-150 hover:brightness-110',
      )}
      onClick={onClick}
      to={to}
    >
      <DebugPin color="orange" title={to} />
      <div className="flex h-full items-center gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
          <Icon className="" />
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-sm">{title}</h2>
            {badge}
          </div>
          <p className="text-v1-content-secondary text-xs">{description}</p>
        </div>
        <ArrowIcon className="ml-auto shrink-0" />
      </div>
    </NavLink>
  );
};
