import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren } from 'react';
import Icon from './Icon';

interface Props {
  icon?: string;
  className?: string;
}

const Banner: React.FC<PropsWithChildren<Props>> = ({
  icon,
  children,
  className,
}) => (
  <div className={clsx('flex rounded-3xl bg-black p-4', className)}>
    {icon && <Icon name={icon} className="mr-2 text-warning" />}
    <div>{children}</div>
  </div>
);

export default Banner;
