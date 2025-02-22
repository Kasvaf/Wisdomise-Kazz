import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import {
  type MouseEventHandler,
  type ReactNode,
  type SVGProps,
  type FC,
} from 'react';
import { useHasFlag } from 'api';
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
      to={to}
      className={clsx(
        className,
        'group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl',
        'h-20 bg-v1-surface-l2 px-3 transition-all duration-150 hover:brightness-110',
      )}
      onClick={onClick}
    >
      <DebugPin title={to} color="orange" />
      <div className="flex h-full items-center gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
          <Icon className="" />
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-sm">{title}</h2>
            {badge}
          </div>
          <p className="text-xs text-v1-content-secondary">{description}</p>
        </div>
        <ArrowIcon className="ml-auto shrink-0" />
      </div>
    </NavLink>
  );
};
