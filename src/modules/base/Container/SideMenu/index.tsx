import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { MAIN_LANDING } from 'config/constants';
import Logo from 'assets/logo-horizontal.svg';
import { useSubscription } from 'api';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import MenuItemsContent from './MenuItemsContent';
import { ReactComponent as ProIcon } from './pro.svg';

const SideMenu: React.FC<{
  className?: string;
  collapsed?: boolean;
  onCollapseClick?: () => void;
}> = ({ className, collapsed }) => {
  const { i18n } = useTranslation();
  const subscription = useSubscription();
  const isLoggedIn = useIsLoggedIn();

  return (
    <div
      className={clsx(
        'fixed inset-y-0 z-30 flex w-[--side-menu-width] flex-col',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-full w-full flex-col justify-between overflow-auto bg-v1-surface-l2 p-4 pt-2',
        )}
      >
        <div className="flex min-h-full flex-col">
          <div className="mb-4 mt-8 flex items-center justify-between border-b border-white/5 pb-4">
            <a
              href={MAIN_LANDING(i18n.language)}
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-2"
            >
              <img className="h-12" src={Logo} alt="logo" />
              {!collapsed && subscription.level !== 0 && isLoggedIn && (
                <ProIcon className="mt-px hidden" />
              )}
            </a>
            {/* <button
              className="rounded-xl bg-white/[.02] p-2 text-white hover:bg-white/10 active:bg-black/5"
              onClick={onCollapseClick}
            >
              <Icon name={collapsed ? bxChevronRight : bxChevronLeft} />
            </button> */}
          </div>

          <MenuItemsContent collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
