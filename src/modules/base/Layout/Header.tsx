import { ReactComponent as Logo } from 'assets/logo-green.svg';
import { bxMenu, bxUser } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { RouterBaseName } from 'config/constants';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import type { FC, ReactElement, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAccountQuery } from 'services/rest';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import Icon from 'shared/Icon';
import usePageTour from 'shared/usePageTour';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useIsLoggedIn } from '../auth/jwt-store';
import BranchSelector from './BranchSelector';
import BtnBack from './BtnBack';
import { BtnLoginLogout } from './BtnLoginLogout';
import { MenuItem, MenuItemGroup, useMenuItems } from './menu';

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
            <MenuItem surface={0} value={menuItems.trench} />
            <MenuItem surface={0} value={menuItems.bluechips} />
            <MenuItemGroup
              button={menuItems.trackers}
              buttonProps={{
                surface: 0,
              }}
              items={[
                menuItems.twitterTracker,
                menuItems.metaTracker,
                menuItems.walletTracker,
              ]}
              itemsProps={{
                surface: 1,
                className: 'w-full justify-start',
                block: true,
              }}
            />
            <MenuItem surface={0} value={menuItems.trades} />
            <MenuItem surface={0} value={menuItems.league} />
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
                <p className="mb-2 px-3 py-2 font-bold text-base md:text-sm">
                  {me.data?.nickname || me.data?.email}
                </p>
              )}
              {isMobile && (
                <>
                  <div className="mb-2 w-full shrink-0">{extension}</div>
                  <MenuItem
                    block
                    className="w-full justify-start"
                    surface={1}
                    value={menuItems.trench}
                  />
                  <MenuItem
                    block
                    className="w-full justify-start"
                    surface={1}
                    value={menuItems.bluechips}
                  />
                  <MenuItemGroup
                    block
                    blockProps={{
                      className: 'w-full',
                    }}
                    button={menuItems.trackers}
                    buttonProps={{
                      surface: 1,
                      block: true,
                      className: 'w-full',
                    }}
                    chevron
                    items={[
                      menuItems.twitterTracker,
                      menuItems.metaTracker,
                      menuItems.walletTracker,
                    ]}
                    itemsProps={{
                      surface: 1,
                      className: 'w-full justify-start',
                      block: true,
                    }}
                  />
                  <MenuItem
                    block
                    className="w-full justify-start"
                    surface={1}
                    value={menuItems.trades}
                  />
                  <MenuItem
                    block
                    className="w-full justify-start"
                    surface={1}
                    value={menuItems.league}
                  />
                </>
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
              <div className="mt-2" />
              <BtnLoginLogout
                block
                className="w-full justify-start"
                surface={1}
              />
            </div>
          }
          tooltipPlacement="top"
        >
          <Button size="xs" surface={1} variant="ghost">
            <Icon className="[&>svg]:size-[18px]" name={bxUser} size={20} />{' '}
            <Icon name={bxMenu} size={20} />
          </Button>
        </ClickableTooltip>
      </div>
    </div>
  );
};
