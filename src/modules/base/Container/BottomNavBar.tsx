import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { useHasFlag } from 'api';
import { DebugPin } from 'shared/DebugPin';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import useIsMobile from 'utils/useIsMobile';
import useMenuItems, { type RootMenuItem } from './useMenuItems';

const BottomNavbar: React.FC<{ className?: string }> = ({ className }) => {
  const { items: MenuItems } = useMenuItems();
  const hasFlag = useHasFlag();
  const location = useLocation();
  const showLoadingBadge = useLoadingBadge();
  const isMobile = useIsMobile();

  const items = MenuItems.filter(i => !i.hide && hasFlag(i.link));

  const renderItem = (item: RootMenuItem) => (
    <NavLink
      to={item.link}
      key={item.link}
      className={clsx(
        'group flex flex-1 flex-col items-center justify-center',
        '[&>svg]:size-7',
        'opacity-60 [&.active]:font-bold [&.active]:text-[#00A3FF] [&.active]:opacity-100',
      )}
    >
      <DebugPin title={item.link} color="orange" />
      {item.icon}
      <div className="mt-1 text-xs font-normal">{item.text}</div>
    </NavLink>
  );

  return location.pathname.startsWith('/account') ? null : (
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
          'fixed bottom-0 z-50 hidden h-16 w-full mobile:block',
          className,
        )}
      >
        <div className="flex h-16 w-full items-center justify-between bg-v1-surface-l2 text-white">
          {items.map(renderItem)}
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
