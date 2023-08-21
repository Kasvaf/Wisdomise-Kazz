import { Crisp } from 'crisp-sdk-web';
import { Dropdown } from 'antd';
import type React from 'react';
import { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUserInfoQuery } from 'api';
import logout from 'modules/auth/logout';
import { MenuItems } from '../SideMenu';
import { ReactComponent as LogoutIcon } from '../header/logout.svg';
import WalletDropdownContent from '../Header/WalletDropdown/WalletDropdownContent';
import HamburgerIcon from './HamburgerIcon';
import { ReactComponent as SupportIcon } from './support.svg';

const openCrisp = () => Crisp.chat.open();

const MobileMenu: React.FC = () => {
  const { data } = useUserInfoQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setClosed = useCallback(() => setIsMenuOpen(false), []);

  const dropDownFn = useCallback(
    () => (
      <div className="mb-4 w-[calc(100vw-2rem)] rounded-3xl bg-white px-4 py-6">
        <div className="flex items-center rounded-3xl bg-black/5 p-2">
          {data?.customer.info.picture ? (
            <img
              className="mr-3 h-8 w-8 rounded-full"
              src={data?.customer.info.picture}
            />
          ) : (
            <div className="mr-3 flex h-12 w-12  items-center justify-center rounded-full bg-black/10 p-3">
              {data?.customer.nickname.charAt(0)}
            </div>
          )}

          <div className="text-base font-semibold text-black">
            {data?.customer.nickname}
            <p className="text-xxs leading-none text-black/60">
              {data?.customer.user.email}
            </p>
          </div>
        </div>

        <div className="flex">
          <div
            className="mr-2 mt-2 flex basis-1/3 items-center justify-center rounded-3xl bg-black/5 p-2"
            onClick={openCrisp}
          >
            <SupportIcon className="mr-2" />
            Support
          </div>
          <div className="mt-2 flex basis-2/3 items-center justify-center rounded-3xl bg-black/5 p-2">
            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-start  text-xs font-medium uppercase text-error"
            >
              <LogoutIcon className="mr-2" /> Logout
            </button>
          </div>
        </div>
        <div className="mt-2 rounded-3xl bg-black/5 p-4">
          <WalletDropdownContent closeDropdown={setClosed} />
        </div>
      </div>
    ),
    [data?.customer, setClosed],
  );

  return (
    <div className="fixed bottom-0 z-10 hidden h-16 w-full items-center justify-between bg-white px-4 py-1 mobile:flex">
      {MenuItems.map(i => (
        <NavLink
          to={i.link}
          key={i.link}
          className="flex flex-col items-center justify-center pb-[14px] pt-[10px] [&.active]:opacity-20"
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
        <div className="flex flex-col items-center justify-center pb-[14px] pt-[10px]">
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
