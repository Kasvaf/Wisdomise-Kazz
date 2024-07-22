import { clsx } from 'clsx';
import { type FC, type ReactNode, type SVGProps } from 'react';
import BetaVersion from './BetaVersion';

export const PageTitle: FC<{
  title?: ReactNode;
  description?: ReactNode;
  icon?: FC<SVGProps<SVGSVGElement>>;
  className?: string;
  isBeta?: boolean;
}> = ({ className, title, description, icon: Icon, isBeta }) => (
  <div className={clsx('flex flex-col gap-2', className)}>
    {(title || Icon) && (
      <h1 className="flex flex-row items-center gap-2 text-base font-bold">
        {Icon && <Icon className="h-5 w-5" />}
        {title}
        {isBeta && <BetaVersion />}
      </h1>
    )}
    {description && <p className="text-xs text-white/60">{description}</p>}
  </div>
);
