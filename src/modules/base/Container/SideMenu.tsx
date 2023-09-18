import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { ATHENA_FE } from 'config/constants';
import Logo from 'assets/logo-horizontal-beta.svg';
import useMenuItems from './useMenuItems';

const SideMenu = () => {
  const MenuItems = useMenuItems();
  return (
    <div className="fixed top-0 z-[2] ml-6 mt-6 flex w-[260px] flex-col mobile:hidden">
      <a
        href={ATHENA_FE}
        className="flex w-full cursor-pointer flex-row items-center justify-center"
      >
        <img className="h-8" src={Logo} alt="logo" />
      </a>
      <div className="mt-6 h-[calc(100vh-104px)] w-full rounded-3xl bg-[#FFFFFF0D] p-6 ">
        {MenuItems.map((item, ind) => (
          <div key={item.link}>
            {(!ind || item.category !== MenuItems[ind - 1].category) && (
              <div className="p-4 text-white/30">{item.category}</div>
            )}
            <NavLink
              to={item.link}
              className={clsx(
                'mb-4 flex cursor-pointer items-center justify-start rounded-full p-4 text-sm',
                'hover:bg-[#FFFFFF0D] [&.active]:bg-[#FFFFFF1A]',
              )}
            >
              <span className="text-white">{item.icon}</span>
              <p className="ml-2 text-white">{item.text}</p>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
