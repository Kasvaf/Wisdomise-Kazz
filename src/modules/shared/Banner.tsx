import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren } from 'react';
import Icon from './Icon';

interface Props {
  icon?: string;
  style?: 'default' | 'warn';
  className?: string;
}

const Banner: React.FC<PropsWithChildren<Props>> = ({
  icon,
  style = 'default',
  children,
  className,
}) => (
  <div
    className={clsx(
      'flex rounded-xl p-4 mobile:p-2',
      style === 'default'
        ? 'bg-black'
        : 'border border-[#F1AA40]/20 !bg-[#F1AA40]/10 text-[#F1AA40]',
      className,
    )}
  >
    {icon && <Icon name={icon} className="mr-4 text-warning mobile:mr-2" />}
    <div>{children}</div>
  </div>
);

export default Banner;
