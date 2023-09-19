import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { bxLeftArrowAlt, bxLinkExternal } from 'boxicons-quasar';
import { ATHENA_FE } from 'config/constants';
import Logo from 'assets/logo-horizontal-beta.svg';
import Icon from 'modules/shared/Icon';
import Button from 'modules/shared/Button';
import useMenuItems from './useMenuItems';

interface Props {
  className?: string;
}

const SideMenu: React.FC<Props> = ({ className }) => {
  const { items: MenuItems, hasExternals } = useMenuItems();
  return (
    <div
      className={clsx(
        'fixed z-[2] ml-6 mt-6 flex w-[260px] flex-col mobile:hidden',
        className,
      )}
    >
      <a
        href={ATHENA_FE}
        className="flex w-full cursor-pointer flex-row items-center justify-center"
      >
        <img className="h-8" src={Logo} alt="logo" />
      </a>
      <div className="mt-6 flex h-[calc(100vh-104px)] w-full flex-col justify-between rounded-3xl bg-[#FFFFFF0D] p-6">
        <div>
          {MenuItems.map((item, ind) => (
            <div key={item.link}>
              {(!ind || item.category !== MenuItems[ind - 1].category) && (
                <div className="p-4 text-white/30">{item.category}</div>
              )}
              <NavLink
                to={item.link}
                className={clsx(
                  'mb-4 flex cursor-pointer items-center justify-start rounded-full p-4 text-sm',
                  'hover:bg-[#FFFFFF0D] [&.active]:bg-[#FFFFFF1A]',
                )}
              >
                <span className="text-white">{item.icon}</span>
                <p className="ml-2 text-white">{item.text}</p>
              </NavLink>
            </div>
          ))}
        </div>

        {hasExternals && (
          <div className="flex flex-col gap-4">
            <Button className="block w-full" to="/app">
              <div className="flex grow items-center justify-between gap-2">
                <span className="font-semibold">Dashboard</span>
                <Icon name={bxLeftArrowAlt} />
              </div>
            </Button>
            <Button className="block w-full" to={ATHENA_FE} target="_blank">
              <div className="flex grow items-center justify-between gap-2">
                <span className="font-semibold">Athena</span>
                <Icon name={bxLinkExternal} />
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
