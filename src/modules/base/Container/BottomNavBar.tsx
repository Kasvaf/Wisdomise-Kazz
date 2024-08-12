import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useHasFlag } from 'api';
import useMenuItems, { type RootMenuItem } from './useMenuItems';
import { ReactComponent as IconMenu } from './useMenuItems/icons/menu.svg';

export default function BottomNavbar() {
  const { items: MenuItems } = useMenuItems();
  const hasFlag = useHasFlag();

  const items = MenuItems.filter(
    i => !i.mobileHide && !i.hide && hasFlag(i.link),
  );

  const renderItem = (item: RootMenuItem) => (
    <NavLink
      to={item.link}
      key={item.link}
      className={clsx(
        'group flex flex-1 flex-col items-center justify-center',
        'opacity-60 [&.active]:font-bold [&.active]:text-[#00A3FF] [&.active]:opacity-100',
      )}
    >
      {item.icon}
    </NavLink>
  );

  return (
    <div className="fixed bottom-0 z-50 hidden h-16 w-full items-center bg-[#1E1F24] text-white mobile:flex">
      <div className="flex w-full items-center justify-between">
        {items.map(renderItem)}
        {renderItem({
          icon: <IconMenu />,
          text: 'Menu',
          link: '/menu',
        })}
      </div>
    </div>
  );
}
