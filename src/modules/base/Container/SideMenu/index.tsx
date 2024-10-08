import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import { MAIN_LANDING } from 'config/constants';
import Icon from 'shared/Icon';
import Logo from 'assets/logo-horizontal.svg';
import MenuItemsContent from './MenuItemsContent';

const SideMenu: React.FC<{
  className?: string;
  collapsed?: boolean;
  onCollapseClick?: () => void;
}> = ({ className, collapsed, onCollapseClick }) => {
  const { i18n } = useTranslation();

  return (
    <div
      className={clsx(
        'fixed inset-y-0 z-30 flex w-[--side-menu-width] flex-col',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-full w-full flex-col justify-between overflow-auto bg-[#1E1F24] pt-2',
          collapsed ? 'p-4' : 'p-6',
        )}
      >
        <div className="flex min-h-full flex-col">
          <div className="mb-4 mt-8 flex items-center justify-between border-b border-white/5 pb-4">
            <a
              href={MAIN_LANDING(i18n.language)}
              className="flex w-full cursor-pointer flex-row items-center justify-start"
            >
              <img className="h-12" src={Logo} alt="logo" />
            </a>
            <button
              className="rounded-xl bg-white/[.02] p-2 text-white hover:bg-white/10 active:bg-black/5"
              onClick={onCollapseClick}
            >
              <Icon name={collapsed ? bxChevronRight : bxChevronLeft} />
            </button>
          </div>

          <MenuItemsContent collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
