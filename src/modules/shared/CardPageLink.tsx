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
  }>
> = ({ to, title, subtitle, icon, children }) => (
  <NavLink to={to} className="group relative block cursor-pointer">
    {icon}
    <div
      className={clsx(
        'flex h-[250px] flex-col justify-between rounded-3xl bg-black/30 p-8',
        'hover:bg-black/40',
      )}
    >
      <div>
        <h2 className="font-medium">{title}</h2>
        <p className="text-xs font-normal text-white/80">{subtitle}</p>
      </div>

      <div className="flex items-end justify-between">
        <div>{children}</div>
        <Icon name={bxRightArrowAlt} className="group-hover:scale-110" />
      </div>
    </div>
  </NavLink>
);

export default CardPageLink;
