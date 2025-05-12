import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { type FC } from 'react';
import { useHasFlag } from 'api';
import { useAppRouteMeta } from 'modules/app/lib';
import { useMenuItems } from './MenuItems/useMenuItems';

const DefaultSidebar: FC<{ className?: string }> = ({ className }) => {
  const MenuItems = useMenuItems();
  const hasFlag = useHasFlag();
  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));
  const { isMatched, getUrl } = useAppRouteMeta();

  return (
    <>
      <div
        className={clsx(
          'flex h-full flex-col items-center justify-start text-white',
          'w-[68px] bg-v1-surface-l2',
          className,
        )}
      >
        {items.map(item => (
          <NavLink
            to={getUrl(item.meta)}
            key={item.link}
            className={clsx(
              'group flex w-full flex-col items-center justify-center py-3 text-xxs',
              isMatched(item.meta) && 'font-bold text-v1-content-brand',
              'hover:text-v1-content-link-hover',
            )}
          >
            <item.icon className="size-7" />
            <div className="mt-1 text-xs font-normal">{item.text}</div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default DefaultSidebar;
