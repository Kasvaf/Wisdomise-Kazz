import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import AnimateHeight from 'react-animate-height';
import { NavLink, useLocation } from 'react-router-dom';
import { bxLeftArrowAlt, bxRightArrowAlt } from 'boxicons-quasar';
import { useHasFlag } from 'api';
import { MAIN_LANDING } from 'config/constants';
import BetaVersion from 'shared/BetaVersion';
import Icon from 'shared/Icon';
import Logo from 'assets/logo-horizontal.svg';
import useMenuItems, { type RootMenuItem } from '../useMenuItems';
import { ReactComponent as TreeMid } from './tree-mid.svg';
import { ReactComponent as TreeLast } from './tree-last.svg';

const MenuItemsGroup: React.FC<{
  item: RootMenuItem;
  isActive: boolean;
  collapsed: boolean;
}> = ({ item, isActive, collapsed }) => {
  const children = item.children?.filter(item => !item.hide);
  const hasFlag = useHasFlag();

  return (
    <div className="text-white">
      <NavLink
        to={item.link}
        target={item.link.startsWith('https://') ? '_blank' : undefined}
        onClick={item.onClick}
        className={clsx(
          'group mb-4 flex h-12 cursor-pointer items-center rounded-xl text-sm',
          'opacity-40 hover:bg-[#FFFFFF0D] hover:opacity-100 [&.active]:bg-[#FFFFFF1A] [&.active]:opacity-100',
          collapsed ? 'justify-center' : 'justify-between px-4',
        )}
      >
        <div className="flex items-center justify-start">
          <span>{item.icon}</span>
          {!collapsed && <p className="ml-2">{item.text}</p>}
        </div>
      </NavLink>
      {children?.length && !collapsed && (
        <AnimateHeight
          height={isActive ? 'auto' : 0}
          duration={200}
          animateOpacity
          className="mt-3"
        >
          <div className="ml-6">
            {children
              .filter(x => !x.hide && hasFlag(x.link))
              .map((subItem, ind, all) => (
                <NavLink
                  key={subItem.link}
                  to={subItem.link}
                  target={
                    subItem.link.startsWith('https://') ? '_blank' : undefined
                  }
                  className={clsx('group flex h-12 items-stretch')}
                  onClick={subItem.onClick}
                >
                  {ind < all.length - 1 ? <TreeMid /> : <TreeLast />}
                  <div
                    className={clsx(
                      'my-1 ml-1 flex grow items-center justify-between rounded-xl px-3 text-sm group-hover:bg-[#FFFFFF0D]',
                      'opacity-40 group-[.active]:bg-[#FFFFFF1A] group-[.active]:opacity-100',
                    )}
                  >
                    {subItem.text}
                    {subItem.isBeta && <BetaVersion minimal />}
                  </div>
                </NavLink>
              ))}
          </div>
        </AnimateHeight>
      )}
    </div>
  );
};

const SideMenu: React.FC<{
  className?: string;
  collapsed: boolean;
  onCollapseClick: () => void;
}> = ({ className, collapsed, onCollapseClick }) => {
  const hasFlag = useHasFlag();
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const { items: MenuItems } = useMenuItems();

  return (
    <div
      className={clsx(
        'fixed inset-y-0 z-30 flex w-[--side-menu-width] flex-col mobile:hidden',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-full w-full flex-col justify-between overflow-auto bg-[#1E1F24] pt-2',
          collapsed ? 'p-4' : 'p-6',
        )}
      >
        <div>
          <div className="mb-4 mt-8 flex items-center justify-between border-b border-white/5 pb-4">
            <a
              href={MAIN_LANDING(i18n.language)}
              className="flex w-full cursor-pointer flex-row items-center justify-start"
            >
              <img className="h-12" src={Logo} alt="logo" />
            </a>
            <button
              className="rounded-xl bg-white/[.03] p-2 text-white hover:bg-white/10 active:bg-black/5"
              onClick={onCollapseClick}
            >
              <Icon name={collapsed ? bxRightArrowAlt : bxLeftArrowAlt} />
            </button>
          </div>

          <div>
            {MenuItems.filter(i => !i.hide && hasFlag(i.link)).map(item => (
              <MenuItemsGroup
                key={item.link}
                item={item}
                isActive={pathname.startsWith(item.link)}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
