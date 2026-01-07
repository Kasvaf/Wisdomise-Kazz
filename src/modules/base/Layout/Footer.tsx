import { clsx } from 'clsx';
import { type FC, type ReactElement, useMemo } from 'react';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
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
      className={clsx(
        value.isActive || value.isSemiActive
          ? 'text-v1-content-brand/75'
          : '!text-v1-content-primary',
        className,
      )}
      onClick={() => handleClickMenuItem(value, asPopupIfPossible)}
      size={isMobile ? 'md' : '2xs'}
      surface={0}
      variant="link"
      {...buttonProps}
    >
      <value.icon />
      {value.text}
    </Button>
  );
};

export const Footer: FC<{
  extension?: null | false | ReactElement;
  className?: string;
}> = ({ extension, className }) => {
  const menuItems = useMenuItems();
  const showLoadingBadge = useLoadingBadge();

  const isMobile = useIsMobile();

  const menuItemsList = useMemo<MenuItemType[]>(() => {
    return [
      menuItems.bluechips,
      menuItems.twitterTracker,
      menuItems.metaTracker,
      menuItems.walletTracker,
    ];
  }, [menuItems]);

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center justify-between gap-2 bg-v1-background-primary px-3 py-1',
        className,
      )}
    >
      {isMobile && (
        <LoadingBadge
          animation="slide-down"
          className="-translate-x-1/2 fixed bottom-16 left-1/2 z-50 mb-2"
          value={showLoadingBadge}
        />
      )}
      <div className="flex items-center justify-start gap-1">
        {menuItemsList.map(menuItem => (
          <MenuItem asPopupIfPossible key={menuItem.link} value={menuItem} />
        ))}
      </div>
      {extension}
    </div>
  );
};
