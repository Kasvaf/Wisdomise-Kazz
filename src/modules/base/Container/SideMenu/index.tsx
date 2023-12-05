import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { bxChevronDown } from 'boxicons-quasar';
import { ATHENA_FE } from 'config/constants';
import Logo from 'assets/logo-horizontal-beta.svg';
import Icon from 'modules/shared/Icon';
import useMenuItems, { type RootMenuItem } from '../useMenuItems';
import { ReactComponent as TreeMid } from './tree-mid.svg';
import { ReactComponent as TreeLast } from './tree-last.svg';

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
          'opacity-40 hover:bg-[#FFFFFF0D] [&.active]:bg-[#FFFFFF1A] [&.active]:opacity-100',
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
                  'ml-1 flex items-center rounded-xl px-4 text-sm',
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
        'fixed bottom-8 z-[2] ml-6 mt-6 flex w-[260px] flex-col mobile:hidden',
        className,
      )}
    >
      <a
        href={ATHENA_FE}
        className="flex w-full cursor-pointer flex-row items-center justify-center"
      >
        <img className="h-8" src={Logo} alt="logo" />
      </a>
      <div className="mt-6 flex h-full w-full flex-col justify-between overflow-auto rounded-xl bg-[#FFFFFF0D] p-6 pt-2">
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
    </div>
  );
};

export default SideMenu;
