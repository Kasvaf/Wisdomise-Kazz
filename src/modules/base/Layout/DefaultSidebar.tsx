import { clsx } from 'clsx';
import { NavLink, useSearchParams } from 'react-router-dom';
import { type FC } from 'react';
import { useHasFlag } from 'api';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { useMenuItems } from './MenuItems/useMenuItems';

const DefaultSidebar: FC<{ className?: string }> = ({ className }) => {
  const MenuItems = useMenuItems();
  const hasFlag = useHasFlag();
  const { params, isMatched, getUrl } = useDiscoveryRouteMeta();
  const [searchParams] = useSearchParams();
  const hasSlug = searchParams.has('slug');
  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));

  return (
    <>
      <div
        className={clsx(
          'flex h-full w-full flex-col items-center justify-start',
          className,
        )}
      >
        {items.map(item => (
          <NavLink
            to={getUrl({
              ...item.meta,
              view:
                params.view === 'list' || !hasSlug
                  ? 'list'
                  : params.view === 'detail'
                    ? 'both'
                    : params.list === item.meta.list
                      ? 'detail'
                      : 'both',
            })}
            key={item.link}
            className={clsx(
              'group flex w-full flex-col items-center justify-center py-3 transition-all',
              isMatched(item.meta) &&
                'bg-v1-surface-l1 font-bold text-v1-content-brand',
              'hover:text-v1-content-link-hover',
            )}
          >
            <item.icon className="size-7" />
            <div className="mt-1 text-xxs font-normal">{item.text}</div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default DefaultSidebar;
