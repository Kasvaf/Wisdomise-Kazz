import { useHasFlag } from 'api';
import { clsx } from 'clsx';
import {
  useDiscoveryBackdropParams,
  useDiscoveryParams,
  useDiscoveryUrlParams,
} from 'modules/discovery/lib';
import { type FC, Fragment } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMenuItems } from './MenuItems/useMenuItems';

const DefaultSidebar: FC<{ className?: string }> = ({ className }) => {
  const MenuItems = useMenuItems();
  const hasFlag = useHasFlag();
  const params = useDiscoveryParams();
  const urlParams = useDiscoveryUrlParams();
  const [backdropParams, setBackdropParams] = useDiscoveryBackdropParams();
  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));
  const location = useLocation();
  const _navigate = useNavigate();

  return (
    <div
      className={clsx(
        'flex h-full w-full flex-col items-center justify-start',
        className,
      )}
    >
      {items.map(item => (
        <Fragment key={item.link}>
          {item.divider && <hr className="w-2/3 border-white/10" />}
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
            onClick={e => {
              // if (item.meta.list === 'portfolio' && !urlParams.detail) {
              //   e.preventDefault();
              //   e.stopPropagation();
              //   setBackdropParams({
              //     list: 'portfolio',
              //     detail: 'wallet',
              //     slugs: ['1'],
              //   });
              //   navigate(`/${backdropParams.detail}`);
              //   return;
              // }

              if (
                !urlParams.list &&
                urlParams.detail &&
                item.link !== '/meta'
              ) {
                if (backdropParams.list === item.meta.list) return;

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
            <div className="mt-1 font-normal text-2xs">{item.text}</div>
          </NavLink>
        </Fragment>
      ))}
    </div>
  );
};

export default DefaultSidebar;
