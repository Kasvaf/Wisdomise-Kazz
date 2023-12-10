import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { bxChevronDown } from 'boxicons-quasar';
import { ATHENA_FE } from 'config/constants';
import Logo from 'assets/logo-horizontal-beta.svg';
import Icon from 'modules/shared/Icon';
import useMenuItems, { type RootMenuItem } from '../useMenuItems';
import { ReactComponent as TreeMid } from './tree-mid.svg';
import { ReactComponent as TreeLast } from './tree-last.svg';
import { ReactComponent as SignOutIcon } from './signout.svg';

const MenuItemsGroup: React.FC<{ item: RootMenuItem; isActive: boolean }> = ({
  item,
  isActive,
}) => {
  return (
    <div className="text-white">
      <NavLink
        to={item.link}
        className={clsx(
          'group mb-4 flex cursor-pointer items-center justify-between rounded-xl p-4 text-sm',
          'opacity-40 hover:bg-[#FFFFFF0D] hover:opacity-100 [&.active]:bg-[#FFFFFF1A] [&.active]:opacity-100',
        )}
      >
        <div className="flex items-center justify-start">
          <span>{item.icon}</span>
          <p className="ml-2">{item.text}</p>
        </div>
        {item.children ? (
          <Icon
            className="-my-6 group-[.active]:-scale-100"
            size={32}
            name={bxChevronDown}
          />
        ) : (
          <div />
        )}
      </NavLink>
      {item.children?.length && isActive && (
        <div className="ml-6 mt-3">
          {item.children.map((subItem, ind, all) => (
            <NavLink
              key={subItem.link}
              to={subItem.link}
              className={clsx('group flex h-12 items-stretch')}
            >
              {ind < all.length - 1 ? <TreeMid /> : <TreeLast />}
              <div
                className={clsx(
                  'my-1 ml-1 flex grow items-center rounded-xl px-4 text-sm group-hover:bg-[#FFFFFF0D]',
                  'opacity-40 group-[.active]:bg-[#FFFFFF1A] group-[.active]:opacity-100',
                )}
              >
                {subItem.text}
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const SideMenu: React.FC<{ className?: string }> = ({ className }) => {
  const { pathname } = useLocation();
  const { items: MenuItems } = useMenuItems();

  return (
    <div
      className={clsx(
        'fixed bottom-0 z-30 flex w-[260px] flex-col mobile:hidden',
        className,
      )}
    >
      <div className="flex h-full w-full flex-col justify-between overflow-auto bg-[#1E1F24] p-6 pt-2">
        <div>
          <a
            href={ATHENA_FE}
            className="my-8 flex w-full cursor-pointer flex-row items-center justify-center"
          >
            <img className="h-12" src={Logo} alt="logo" />
          </a>
          <div>
            {MenuItems.map(item => (
              <MenuItemsGroup
                key={item.link}
                item={item}
                isActive={pathname.startsWith(item.link)}
              />
            ))}
          </div>
        </div>

        <NavLink
          to="/auth/logout"
          className="flex items-center rounded-xl p-4 text-white opacity-40 hover:bg-[#FFFFFF0D] hover:opacity-100"
        >
          <SignOutIcon />
          <div className="ml-2">Sign out</div>
        </NavLink>
      </div>
    </div>
  );
};

export default SideMenu;
