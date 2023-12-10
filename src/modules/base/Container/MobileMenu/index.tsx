import { clsx } from 'clsx';
import type React from 'react';
import { NavLink } from 'react-router-dom';
import useMenuItems from '../useMenuItems';

const MobileMenu: React.FC = () => {
  const { items: MenuItems } = useMenuItems();

  return (
    <div className="fixed bottom-0 z-10 hidden h-16 w-full items-stretch justify-between bg-[#1E1F24] text-white mobile:flex">
      {MenuItems.filter(i => !i.mobileHide).map(i => (
        <NavLink
          to={i.link}
          key={i.link}
          className={clsx(
            'group m-2 flex flex-1 flex-col items-center justify-center rounded-lg',
            'opacity-60 [&.active]:bg-black/5 [&.active]:font-bold [&.active]:opacity-100',
          )}
        >
          {i.icon}
          <p className="text-xxs font-medium">{i.text}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileMenu;
