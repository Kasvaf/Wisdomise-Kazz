import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import Icon from 'modules/shared/Icon';

const CardPageLink: React.FC<
  PropsWithChildren<{
    to: string;
    title: string;
    subtitle: string;
    icon: React.ReactElement;
    height?: 180 | 250;
  }>
> = ({ to, title, subtitle, icon, children, height = 180 }) => (
  <NavLink to={to} className="group relative block cursor-pointer">
    <div className="absolute right-0 top-0 z-[-1]">{icon}</div>
    <div
      className={clsx(
        'flex flex-col justify-between rounded-3xl bg-black/30 mobile:p-6',
        height === 180
          ? 'h-[180px] p-6 mobile:h-[160px]'
          : 'h-[250px] p-8 mobile:h-[180px]',
        'hover:bg-black/40',
      )}
    >
      <div>
        <h2 className="text-base font-medium mobile:text-sm">{title}</h2>
        <p className="text-xs font-normal text-white/80 mobile:text-[10px]">
          {subtitle}
        </p>
      </div>

      <div className="flex items-end justify-between">
        <div>{children}</div>
        <Icon name={bxRightArrowAlt} className="group-hover:scale-110" />
      </div>
    </div>
  </NavLink>
);

export default CardPageLink;
