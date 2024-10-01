import { clsx } from 'clsx';
import { type MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimateHeight from 'react-animate-height';
import { NavLink, useLocation } from 'react-router-dom';
import { bxChevronDown, bxChevronUp } from 'boxicons-quasar';
import { useHasFlag } from 'api';
import { useLogoutMutation } from 'api/auth';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import BetaVersion from 'shared/BetaVersion';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import useMenuItems, { type RootMenuItem } from '../useMenuItems';
import { ReactComponent as LogoutIcon } from './logout-icon.svg';
import { ReactComponent as HelpIcon } from './help-icon.svg';

const MenuItemsGroup: React.FC<{
  item: RootMenuItem;
  isActive: boolean;
  collapsed?: boolean;
  onClick: (item: string) => void;
}> = ({ item, isActive, collapsed, onClick }) => {
  const children = item.children?.filter(item => !item.hide);
  const hasFlag = useHasFlag();

  return (
    <div className="mb-2 text-white mobile:border-b mobile:border-white/5">
      <NavLink
        to={item.link}
        target={item.link.startsWith('https://') ? '_blank' : undefined}
        onClick={e => {
          e.preventDefault();
          item.onClick?.();
          onClick(item.link);
        }}
        className={clsx(
          'group mb-2 flex h-12 cursor-pointer items-center rounded-xl text-sm',
          'opacity-70 hover:bg-[#FFFFFF0D] hover:opacity-100 [&.active]:bg-[#FFFFFF1A] [&.active]:opacity-100',
          collapsed ? 'justify-center' : 'justify-between px-4',
        )}
      >
        <div className="flex items-center justify-start">
          <span>{item.icon}</span>
          {!collapsed && <p className="ml-2">{item.text}</p>}
        </div>
        {!collapsed && <Icon name={isActive ? bxChevronUp : bxChevronDown} />}
      </NavLink>
      {children?.length && !collapsed && (
        <AnimateHeight
          height={isActive ? 'auto' : 0}
          duration={200}
          animateOpacity
        >
          <div className="ml-7">
            {children
              .filter(x => !x.hide && hasFlag(x.link))
              .map(subItem => (
                <NavLink
                  key={subItem.link}
                  to={subItem.link}
                  target={
                    subItem.link.startsWith('https://') ? '_blank' : undefined
                  }
                  className={clsx('group flex h-[40px] items-stretch')}
                  onClick={subItem.onClick}
                >
                  <div className="flex items-center">
                    <div className="h-1 w-1 rounded-full bg-white group-hover:bg-info group-[.active]:bg-info" />
                  </div>
                  <div
                    className={clsx(
                      'my-1 ml-1 flex grow items-center justify-between rounded-xl px-3 text-sm group-hover:text-info',
                      'opacity-70 group-[.active]:text-info group-[.active]:opacity-100',
                    )}
                  >
                    {subItem.text}
                    {subItem.badge && (
                      <BetaVersion minimal variant={subItem.badge} />
                    )}
                  </div>
                </NavLink>
              ))}
          </div>
        </AnimateHeight>
      )}
    </div>
  );
};

const MenuItemsContent: React.FC<{
  collapsed?: boolean;
}> = ({ collapsed }) => {
  const hasFlag = useHasFlag();
  const { t } = useTranslation();
  const isLoggedIn = useIsLoggedIn();
  const { items: MenuItems } = useMenuItems();

  const { pathname } = useLocation();
  const [activeMenu, setActiveMenu] = useState(pathname);

  const [ModalLogin, showModalLogin] = useModalLogin();
  const { mutateAsync, isLoading: loggingOut } = useLogoutMutation();

  const extraItems = [
    {
      icon: <HelpIcon />,
      label: 'Help & Guide',
      to: 'https://help.wisdomise.com/',
    },
    isLoggedIn
      ? {
          icon: <LogoutIcon />,
          label: t('base:user.sign-out'),
          to: '/auth/logout',
          className: 'text-error',
          loading: loggingOut,
          onClick: (e => {
            e.preventDefault();
            void mutateAsync({});
          }) satisfies MouseEventHandler<HTMLAnchorElement>,
        }
      : {
          icon: <LogoutIcon />,
          label: t('base:user.sign-in'),
          to: '/auth/login',
          onClick: (e => {
            e.preventDefault();
            void showModalLogin();
          }) satisfies MouseEventHandler<HTMLAnchorElement>,
          className: 'text-success',
        },
  ];
  return (
    <>
      <div>
        {MenuItems.filter(i => !i.hide && hasFlag(i.link)).map(item => (
          <MenuItemsGroup
            key={item.link}
            item={item}
            collapsed={collapsed}
            onClick={newActiveMenu =>
              setActiveMenu(p => (p === newActiveMenu ? '' : newActiveMenu))
            }
            isActive={activeMenu?.startsWith(item.link)}
          />
        ))}
      </div>

      {ModalLogin}
      <div className="grow" />
      <div className="mt-12 text-white">
        {extraItems.map(item => (
          <NavLink
            key={item.to}
            onClick={item.onClick}
            to={item.to ?? ''}
            target={/^https?:\/\//.test(item.to ?? '') ? '_blank' : undefined}
            className={clsx(
              'mb-4 flex h-12 cursor-pointer items-center rounded-xl text-sm',
              collapsed ? 'justify-center' : 'justify-between px-4',
              'opacity-70 hover:bg-[#FFFFFF0D] hover:opacity-100 [&.active]:opacity-100',
              item.className,
            )}
          >
            <div className="flex items-center justify-start">
              {item.icon}
              {!collapsed && (
                <p className="ml-2 flex items-center">
                  {item.label}
                  {item.loading && <Spin className="ml-1" />}
                </p>
              )}
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default MenuItemsContent;
