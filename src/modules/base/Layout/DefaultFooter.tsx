import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { type FC } from 'react';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import useIsMobile from 'utils/useIsMobile';
import { useHasFlag } from 'api';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { useMenuItems } from './MenuItems/useMenuItems';

const TOUR_CLASS = 'id-tour-bottom-navbar';

const DefaultFooter: FC<{ className?: string }> = ({ className }) => {
  const showLoadingBadge = useLoadingBadge();
  const MenuItems = useMenuItems();
  const hasFlag = useHasFlag();
  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));
  const isMobile = useIsMobile();
  const { isMatched, getUrl } = useDiscoveryRouteMeta();

  return (
    <>
      {isMobile && (
        <LoadingBadge
          value={showLoadingBadge}
          animation="slide-down"
          className="fixed bottom-16 left-1/2 z-50 mb-2 -translate-x-1/2"
        />
      )}

      <div
        className={clsx(
          'flex w-full items-stretch justify-between gap-2 text-white',
          'h-16 bg-v1-surface-l2',
          TOUR_CLASS,
          className,
        )}
      >
        {items.map(item => (
          <NavLink
            to={getUrl({
              ...item.meta,
              view: 'list',
              slug: undefined,
            })}
            key={item.link}
            className={clsx(
              'group flex flex-1 flex-col items-center justify-center',
              isMatched(item.meta) && 'font-bold text-v1-content-brand',
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

export default DefaultFooter;
