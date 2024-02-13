import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import useMenuItems, { type RootMenuItem } from './useMenuItems';
import AthenaFloatMobileIcon from './AthenaFloat/AthenaFloatMobileIcon';

export default function BottomNavbar() {
  const { items: MenuItems } = useMenuItems();
  const items = MenuItems.filter(i => !i.mobileHide && !i.hide);

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

  return (
    <div className="fixed bottom-0 z-50 hidden h-16 w-full items-stretch justify-between bg-[#1E1F24] text-white mobile:grid mobile:grid-cols-5">
      <div className="col-span-2 self-center">
        {items[1] && renderItem(items[0])}
      </div>
      <div className="w-20">
        <AthenaFloatMobileIcon />
      </div>
      {items[0] && renderItem(items[1])}
      {items[0] && renderItem(items[2])}
    </div>
  );
}
