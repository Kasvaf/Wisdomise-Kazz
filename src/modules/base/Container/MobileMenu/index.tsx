import { clsx } from 'clsx';
import type React from 'react';
import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useMenuItems from '../useMenuItems';
import HamburgerIcon from './HamburgerIcon';
import ExtraContent from './ExtraContent';

const MobileMenu: React.FC = () => {
  const { items: MenuItems } = useMenuItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setClosed = useCallback(() => setIsMenuOpen(false), []);

  const dropDownFn = useCallback(
    () => <ExtraContent onClose={setClosed} />,
    [setClosed],
  );

  return (
    <div className="fixed bottom-0 z-10 hidden h-16 w-full items-stretch justify-between bg-white mobile:flex">
      {MenuItems.filter(i => !i.mobileHide).map(i => (
        <NavLink
          to={i.link}
          key={i.link}
          className={clsx(
            'm-2 flex flex-1 flex-col items-center justify-center rounded-lg',
            'opacity-60 [&.active]:bg-black/5 [&.active]:font-bold [&.active]:opacity-100',
          )}
        >
          {i.icon}
          <p className="text-xxs font-medium">{i.mobileText || i.text}</p>
        </NavLink>
      ))}
      <Dropdown
        open={isMenuOpen}
        placement="topRight"
        onOpenChange={setIsMenuOpen}
        dropdownRender={dropDownFn}
      >
        <div className="mx-2 flex flex-1 flex-col items-center justify-center">
          <HamburgerIcon open={isMenuOpen} setOpen={setIsMenuOpen} />
          <p className="text-xxs font-medium">
            {isMenuOpen ? 'Close' : 'Menu'}
          </p>
        </div>
      </Dropdown>
    </div>
  );
};

export default MobileMenu;
