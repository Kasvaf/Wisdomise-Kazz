import { clsx } from 'clsx';
import { Link, NavLink } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useHasFlag, useSubscription } from 'api';
import useMenuItems, { type RootMenuItem } from './useMenuItems';
import { ReactComponent as IconMenu } from './useMenuItems/icons/menu.svg';
import LogoBlack from './logo-black.png';

export default function BottomNavbar() {
  const { items: MenuItems } = useMenuItems();
  const subscription = useSubscription();
  const hasFlag = useHasFlag();

  const items = MenuItems.filter(
    i => !i.mobileHide && !i.hide && hasFlag(i.link),
  );

  const renderItem = (item: RootMenuItem) => (
    <NavLink
      to={item.link}
      key={item.link}
      className={clsx(
        'group flex flex-1 flex-col items-center justify-center',
        'opacity-60 [&.active]:font-bold [&.active]:text-[#00A3FF] [&.active]:opacity-100',
      )}
    >
      {item.icon}
    </NavLink>
  );

  return (
    <div className="fixed bottom-0 z-50 hidden h-auto w-full mobile:block">
      {subscription.levelType !== 'pro' && (
        <div className="flex h-10 items-center gap-2 bg-pro-gradient px-4 text-xs">
          <img src={LogoBlack} className="-ms-2 mt-[15px] w-7 shrink-0" />
          <div className="grow">
            <Trans
              ns="pro"
              i18nKey="expires-soon"
              values={{
                days: subscription.remaining,
              }}
            />
          </div>
          <Link
            to="/account/billing"
            className="inline-flex h-6 shrink-0 items-center rounded bg-v1-background-primary px-3 text-v1-content-primary"
          >
            <Trans ns="pro" i18nKey="upgrade-now" />
          </Link>
        </div>
      )}
      <div className="flex h-16 w-full items-center justify-between bg-[#1E1F24] text-white">
        {items.map(renderItem)}
        {renderItem({
          icon: <IconMenu />,
          text: 'Menu',
          link: '/menu',
        })}
      </div>
    </div>
  );
}
