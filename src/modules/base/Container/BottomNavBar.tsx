import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useHasFlag } from 'api';
import useMenuItems, { type RootMenuItem } from './useMenuItems';
import AthenaFloatMobileIcon from './AthenaFloat/AthenaFloatMobileIcon';

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
        'opacity-60 [&.active]:font-bold [&.active]:opacity-100',
      )}
    >
      {item.icon}
      <p className="text-xxs font-medium">{item.text}</p>
    </NavLink>
  );

  const mid = Math.floor(items.length / 2);
  return (
    <div className="fixed bottom-0 z-50 hidden h-16 w-full items-center bg-[#1E1F24] text-white mobile:flex">
      <div className="flex w-[calc((100%-5rem)/2)] items-center justify-between">
        {items.slice(0, mid).map(renderItem)}
      </div>
      <div className="w-[5rem]">
        <AthenaFloatMobileIcon />
      </div>
      <div className="flex w-[calc((100%-5rem)/2)] items-center justify-between">
        {items.slice(mid).map(renderItem)}
      </div>
    </div>
  );
}
