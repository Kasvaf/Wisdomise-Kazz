import { clsx } from 'clsx';
import {
  type SVGProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

export const ProfileSection: FC<
  PropsWithChildren<{
    className?: string;
    contentClassName?: string;
    icon?: FC<SVGProps<SVGSVGElement>>;
    label: string;
    titlebarContent?: ReactNode;
  }>
> = ({
  className,
  contentClassName,
  icon: Icon,
  label,
  children,
  titlebarContent,
}) => {
  return (
    <div className={className}>
      <h2 className="mb-3 flex max-w-full items-center justify-start gap-1 overflow-auto">
        {' '}
        {Icon && <Icon className="h-5 w-5" />}
        <span className="text-lg font-bold"> {label}</span>
        {titlebarContent && (
          <span className="ml-4 shrink-0">{titlebarContent}</span>
        )}
      </h2>
      <div className={clsx('max-w-full overflow-auto', contentClassName)}>
        {children}
      </div>
    </div>
  );
};
