import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { useHasFlag } from 'api';
import { DebugPin } from 'shared/DebugPin';
import useMenuItems, { type RootMenuItem } from './useMenuItems';

const BottomNavbar: React.FC<{ className?: string }> = ({ className }) => {
  const { items: MenuItems } = useMenuItems();
  const hasFlag = useHasFlag();
  const location = useLocation();

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
