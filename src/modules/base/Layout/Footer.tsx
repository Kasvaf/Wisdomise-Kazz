import { clsx } from 'clsx';
import type { FC, ReactElement } from 'react';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import useIsMobile from 'utils/useIsMobile';
import { MenuItem, MenuItemGroup, useMenuItems } from './menu';

export const Footer: FC<{
  extension?: null | false | ReactElement;
  className?: string;
}> = ({ extension, className }) => {
  const menuItems = useMenuItems();
  const showLoadingBadge = useLoadingBadge();

  const isMobile = useIsMobile();

  return (
    <div
      className={clsx(
        'flex h-full flex-wrap items-center justify-between gap-2 bg-v1-background-primary px-3 py-1',
        className,
      )}
    >
      {isMobile && (
        <LoadingBadge
          animation="slide-down"
          className="-translate-x-1/2 fixed bottom-16 left-1/2 z-50 mb-8"
          value={showLoadingBadge}
        />
      )}
      {isMobile ? (
        <div className="flex w-full items-center justify-center gap-1">
          <MenuItem
            asPopupIfPossible
            className="!flex-col !py-2 !h-13"
            surface={0}
            value={menuItems.trench}
          />
          <MenuItem
            asPopupIfPossible
            className="!flex-col !py-2 !h-13"
            surface={0}
            value={menuItems.bluechips}
          />
          <MenuItemGroup
            button={menuItems.trackers}
            buttonProps={{ surface: 0, className: '!flex-col !py-2 !h-13' }}
            items={[menuItems.twitterTracker, menuItems.walletTracker]}
            itemsProps={{ surface: 1 }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-start gap-1">
          <MenuItem asPopupIfPossible surface={0} value={menuItems.trench} />
          <MenuItem asPopupIfPossible surface={0} value={menuItems.bluechips} />
          <MenuItem
            asPopupIfPossible
            surface={0}
            value={menuItems.twitterTracker}
          />
          <MenuItem
            asPopupIfPossible
            surface={0}
            value={menuItems.walletTracker}
          />
        </div>
      )}
      {extension}
    </div>
  );
};
