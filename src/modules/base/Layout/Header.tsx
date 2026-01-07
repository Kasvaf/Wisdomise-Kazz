import { ReactComponent as Logo } from 'assets/logo-green.svg';
import { bxChevronDown, bxMenu, bxUser } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { RouterBaseName } from 'config/constants';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import {
  type FC,
  type ReactElement,
  type ReactNode,
  useMemo,
  useState,
} from 'react';
import AnimateHeight from 'react-animate-height';
import { NavLink } from 'react-router-dom';
import { useAccountQuery } from 'services/rest';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import Icon from 'shared/Icon';
import usePageTour from 'shared/usePageTour';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useIsLoggedIn } from '../auth/jwt-store';
import BranchSelector from './BranchSelector';
import BtnBack from './BtnBack';
import { BtnLoginLogout } from './BtnLoginLogout';
import {
  type MenuItem as MenuItemType,
  useHandleClickMenuItem,
  useMenuItems,
} from './menu';

const MenuItem: FC<
  {
    value: MenuItemType;
    className?: string;
    asPopupIfPossible?: boolean;
  } & Omit<ButtonProps, 'value' | 'className'>
> = ({ value, asPopupIfPossible, className, ...buttonProps }) => {
  const isMobile = useIsMobile();
  const handleClickMenuItem = useHandleClickMenuItem();

  if (value.isDisabled) return null;

  return (
    <Button
      className={clsx(value.isActive && '!text-v1-content-brand', className)}
      onClick={() => handleClickMenuItem(value, asPopupIfPossible)}
      size={isMobile ? 'md' : 'sm'}
      surface={0}
      variant="ghost"
      {...buttonProps}
    >
      <value.icon />
      {value.text}
    </Button>
  );
};

const MenuItemGroup: FC<{
  value: MenuItemType[];
  button: MenuItemType;
  className?: string;
}> = ({ value, button, className }) => {
  const isActive = value.some(x => x.isActive) || button.isActive;
  const [isMobileOpen, setIsMobileOpen] = useState(isActive);
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div className={clsx('w-full', className)}>
        <Button
          className="w-full"
          onClick={() => setIsMobileOpen(p => !p)}
          size="sm"
          surface={1}
          variant="ghost"
        >
          <button.icon />
          {button.text}
          <div className="flex w-full shrink grow justify-end">
            <Icon
              className={clsx('-mx-1', isMobileOpen && 'rotate-180')}
              name={bxChevronDown}
              size={16}
            />
          </div>
        </Button>
        <AnimateHeight height={isMobileOpen ? 'auto' : 0}>
          <div className="flex w-full flex-col items-start justify-start gap-0 ps-6">
            {value.map(subMenuItem => (
              <MenuItem
                block
                className="w-full justify-start"
                key={subMenuItem.link}
                surface={1}
                value={subMenuItem}
              />
            ))}
          </div>
        </AnimateHeight>
      </div>
    );
  }
  return (
    <ClickableTooltip
      chevron={false}
      title={
        <div className="-m-1">
          {value.map(item => (
            <MenuItem
              block
              className="!justify-start !px-2 w-full"
              key={item.link}
              surface={1}
              value={item}
            />
          ))}
        </div>
      }
    >
      <Button
        className={clsx(isActive && '!text-v1-content-brand', className)}
        size="sm"
        surface={0}
        variant="ghost"
      >
        <button.icon />
        {button.text}

        <Icon className="-mx-1" name={bxChevronDown} size={16} />
      </Button>
    </ClickableTooltip>
  );
};

export const Header: FC<{
  title?: ReactNode;
  extension?: null | false | ReactElement;
  hasBack?: boolean;
  className?: string;
}> = ({ extension, title, hasBack, className }) => {
  const menuItems = useMenuItems();

  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const me = useAccountQuery();

  usePageTour({
    key: 'closed-trades',
    enabled: !!menuItems.trades.tour && !menuItems.trades.isDisabled,
    delay: 500,
    steps: [
      {
        selector: '.id-tour-trades-btn',
        content: (
          <>
            <div className="mb-2 font-semibold">
              Track your performance here.
            </div>
            <div>
              Check the Trade History tab to review your open and closed
              position.
            </div>
          </>
        ),
      },
    ],
  });

  const menuItemsList = useMemo<(MenuItemType | MenuItemType[])[]>(() => {
    return [
      menuItems.trench,
      menuItems.portfolio,
      [
        menuItems.trackers,
        menuItems.bluechips,
        menuItems.twitterTracker,
        menuItems.metaTracker,
        menuItems.walletTracker,
      ],
      menuItems.trades,
      menuItems.league,
    ];
  }, [menuItems]);

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center justify-between gap-2 bg-v1-background-primary p-3',
        className,
      )}
    >
      <div className="flex items-center justify-start gap-2">
        {hasBack && isMobile && <BtnBack />}

        {title}

        <NavLink className="pe-4 md:max-xl:pe-3" to="/">
          <Logo className="h-8 w-auto" />
        </NavLink>

        {!isMobile && (
          <div className="flex items-center justify-start gap-0">
            {menuItemsList.map(menuItem =>
              Array.isArray(menuItem) ? (
                <MenuItemGroup
                  button={menuItem[0]}
                  key={menuItem[0].link}
                  value={menuItem.slice(1)}
                />
              ) : (
                <MenuItem key={menuItem.link} value={menuItem} />
              ),
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
        {!isMobile && extension && <>{extension}</>}

        {RouterBaseName && <BranchSelector />}

        <BtnWalletConnect />

        <ClickableTooltip
          chevron={false}
          title={
            <div className="flex flex-col items-center justify-start gap-0">
              {isLoggedIn && (
                <p className="mb-3 px-3 font-bold text-base md:text-sm">
                  {me.data?.nickname || me.data?.email}
                </p>
              )}
              {isMobile && (
                <div className="mb-3 w-full shrink-0">{extension}</div>
              )}
              {isMobile &&
                menuItemsList.map(menuItem =>
                  Array.isArray(menuItem) ? (
                    <MenuItemGroup
                      button={menuItem[0]}
                      className="w-full justify-start"
                      key={menuItem[0].link}
                      value={menuItem.slice(1)}
                    />
                  ) : (
                    <MenuItem
                      block
                      className="w-full justify-start"
                      key={menuItem.link}
                      surface={1}
                      value={menuItem}
                    />
                  ),
                )}
              {isMobile && (
                <div className="my-2 w-full border-b border-b-white/10" />
              )}
              <MenuItem
                block
                className="w-full justify-start"
                surface={1}
                value={menuItems.referral}
              />
              <MenuItem
                block
                className="w-full justify-start"
                surface={1}
                value={menuItems.rewards}
              />
              <MenuItem
                block
                className="w-full justify-start"
                surface={1}
                value={menuItems.docs}
              />
              <div className="my-2 w-full border-b border-b-white/10" />
              <BtnLoginLogout
                block
                className="w-full justify-start"
                surface={1}
              />
            </div>
          }
          tooltipPlacement="top"
        >
          <Button size={isMobile ? 'sm' : 'xs'} surface={1} variant="ghost">
            <Icon className="[&>svg]:size-[18px]" name={bxUser} size={20} />{' '}
            <Icon name={bxMenu} size={20} />
          </Button>
        </ClickableTooltip>
      </div>
    </div>
  );
};
