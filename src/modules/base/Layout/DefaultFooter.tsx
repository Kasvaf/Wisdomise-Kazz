import { clsx } from 'clsx';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { type FC } from 'react';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import useIsMobile from 'utils/useIsMobile';
import { useHasFlag } from 'api';
import { DebugPin } from 'shared/DebugPin';
import { useMenuItems } from './MenuItems/useMenuItems';
import { useNavigateToMenuItem } from './MenuItems/useNavigateToMenuItem';

const TOUR_CLASS = 'tour-item-bottom-navbar';

const DefaultFooter: FC<{ className?: string }> = ({ className }) => {
  const showLoadingBadge = useLoadingBadge();
  const MenuItems = useMenuItems();
  const hasFlag = useHasFlag();
  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));
  const isMobile = useIsMobile();
  const navigateToMenuItem = useNavigateToMenuItem();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

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
          'flex w-full items-stretch justify-between text-white',
          TOUR_CLASS,
          'h-16 bg-v1-surface-l2',
          className,
        )}
      >
        {items.map(item => (
          <NavLink
            to={item.link}
            key={item.link}
            onClick={e => {
              e.preventDefault();
              navigateToMenuItem(item.key);
            }}
            className={clsx(
              'group flex flex-1 flex-col items-center justify-center',
              pathname === '/discovery' &&
                searchParams.get('list') === item.key &&
                'font-bold text-v1-content-brand',
              'hover:text-v1-content-link-hover',
            )}
          >
            <DebugPin title={item.link} color="orange" />
            <item.icon className="size-7" />
            <div className="mt-1 text-xs font-normal">{item.text}</div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default DefaultFooter;
