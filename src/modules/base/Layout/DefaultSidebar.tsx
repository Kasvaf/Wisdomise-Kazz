import { useHasFlag } from 'api';
import { clsx } from 'clsx';
import {
  useDiscoveryBackdropParams,
  useDiscoveryParams,
  useDiscoveryUrlParams,
} from 'modules/discovery/lib';
import type { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useMenuItems } from './MenuItems/useMenuItems';

const DefaultSidebar: FC<{ className?: string }> = ({ className }) => {
  const MenuItems = useMenuItems();
  const hasFlag = useHasFlag();
  const params = useDiscoveryParams();
  const urlParams = useDiscoveryUrlParams();
  const [backdropParams, setBackdropParams] = useDiscoveryBackdropParams();
  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));
  const location = useLocation();

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
            // todo: not a good solution
            (location.pathname === '/meta'
              ? item.link.includes(location.pathname)
              : item.meta.list === params.list) &&
              '!text-v1-content-brand bg-v1-surface-l1 font-bold',
            'hover:text-v1-content-link-hover',
          )}
          key={item.link}
          onClick={e => {
            if (!urlParams.list && urlParams.detail && item.link !== '/meta') {
              e.preventDefault();
              e.stopPropagation();
              setBackdropParams({
                list:
                  backdropParams.list === item.meta.list
                    ? undefined
                    : item.meta.list,
              });
            }
          }}
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
