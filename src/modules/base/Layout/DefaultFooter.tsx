import { useHasFlag } from 'api';
import { clsx } from 'clsx';
import { useDiscoveryParams } from 'modules/discovery/lib';
import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import useIsMobile from 'utils/useIsMobile';
import { useMenuItems } from './MenuItems/useMenuItems';

const TOUR_CLASS = 'id-tour-bottom-navbar';

const DefaultFooter: FC<{ className?: string }> = ({ className }) => {
  const showLoadingBadge = useLoadingBadge();
  const MenuItems = useMenuItems();
  const hasFlag = useHasFlag();
  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));
  const isMobile = useIsMobile();
  const params = useDiscoveryParams();

  return (
    <>
      {isMobile && (
        <LoadingBadge
          animation="slide-down"
          className="-translate-x-1/2 fixed bottom-16 left-1/2 z-50 mb-2"
          value={showLoadingBadge}
        />
      )}

      <div
        className={clsx(
          'flex w-full items-stretch justify-between gap-2 border-white/5 border-t text-white',
          'h-16 bg-v1-surface-l1',
          TOUR_CLASS,
          className,
        )}
      >
        {items.map(item => (
          <NavLink
            className={clsx(
              'group flex flex-1 flex-col items-center justify-center',
              item.meta.list === params.list &&
                'font-bold text-v1-content-brand',
              'hover:text-v1-content-link-hover',
            )}
            key={item.link}
            to={`/${item.meta.list ?? 'trench'}`}
          >
            <item.icon className="size-7" />
            <div className="mt-1 font-normal text-xxs">{item.text}</div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default DefaultFooter;
