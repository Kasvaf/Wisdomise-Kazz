import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import Icon from 'shared/Icon';
import { useHasFlag } from 'api';

const CardPageLink: React.FC<
  PropsWithChildren<{
    to: string;
    title: string;
    subtitle: string;
    icon: React.ReactElement;
    height?: 180 | 250;
    onClick?: () => void;
  }>
> = ({ to, title, subtitle, icon, children, height = 180, onClick }) => {
  const hasFlag = useHasFlag();
  if (!hasFlag(to)) return null;

  return (
    <NavLink
      to={to}
      target={to.startsWith('https://') ? '_blank' : undefined}
      className="group relative block cursor-pointer rounded-3xl bg-black/30 hover:bg-black/40"
      onClick={onClick}
    >
      <div className="absolute right-0 top-0">{icon}</div>
      <div
        className={clsx(
          'relative z-10 flex flex-col justify-between mobile:p-6',
          height === 180
            ? 'h-[180px] p-6 mobile:h-[160px]'
            : 'h-[250px] p-8 mobile:h-[180px]',
        )}
      >
        <div>
          <h2 className="text-base font-medium mobile:text-sm">{title}</h2>
          <p className="text-xs font-normal text-white/80 mobile:text-[10px]">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>{children}</div>
          <Icon name={bxRightArrowAlt} className="group-hover:scale-110" />
        </div>
      </div>
    </NavLink>
  );
};

export default CardPageLink;
