import { useHasFlag } from 'api';
import { clsx } from 'clsx';
import { useDiscoveryParams } from 'modules/discovery/lib';
import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useMenuItems } from './MenuItems/useMenuItems';

const DefaultSidebar: FC<{ className?: string }> = ({ className }) => {
  const MenuItems = useMenuItems();
  const hasFlag = useHasFlag();
  const [params] = useDiscoveryParams();
  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));

  return (
    <div
      className={clsx(
        'flex h-full w-full flex-col items-center justify-start',
        className,
      )}
    >
      {items.map(item => (
        <NavLink
          className={clsx(
            'group flex w-full flex-col items-center justify-center py-3 transition-all',
            item.meta.list === params.list &&
              'bg-v1-surface-l1 font-bold text-v1-content-brand',
            'hover:text-v1-content-link-hover',
          )}
          key={item.link}
          to={item.link}
        >
          <item.icon className="size-7" />
          <div className="mt-1 font-normal text-xxs">{item.text}</div>
        </NavLink>
      ))}
    </div>
  );
};

export default DefaultSidebar;
