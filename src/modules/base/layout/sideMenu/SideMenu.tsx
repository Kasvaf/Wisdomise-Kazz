import { NavLink } from 'react-router-dom';
import { ReactComponent as AssetOverviewIcon } from './icons/assetOverview.svg';
import { ReactComponent as ProductsCatalogIcon } from './icons/productsCatalog.svg';
import { ReactComponent as SignalsIcon } from './icons/signals.svg';
import Logo from './icons/logo.svg';

export const SideMenu = () => {
  return (
    <div className="fixed top-0 z-[2] ml-6 mt-6 flex w-[260px] flex-col mobile:hidden">
      <div className="flex w-full cursor-pointer flex-row items-center justify-center">
        <img className="h-8" src={Logo} alt="logo" />
      </div>
      <div className="mt-6 h-[calc(100vh-104px)] w-full rounded-3xl bg-[#FFFFFF0D] p-6 ">
        {MenuItems.map(i => (
          <NavLink
            key={i.link}
            to={i.link}
            className="mb-4 flex cursor-pointer items-center justify-start rounded-full p-4 text-sm hover:bg-[#FFFFFF0D] [&.active]:bg-[#FFFFFF1A]"
          >
            <span className="text-white">{i.icon}</span>
            <p className="leading-0 ml-2 text-white">{i.text}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export const MenuItems = [
  {
    icon: <AssetOverviewIcon />,
    text: 'Asset Overview',
    mobileText: 'Asset',
    link: 'app/assets',
    hide: false,
  },
  {
    icon: <ProductsCatalogIcon />,
    text: 'Products Catalog',
    mobileText: 'Products',
    link: 'app/products-catalog',
  },
  {
    icon: <SignalsIcon />,
    text: 'Signal Matrix',
    link: 'app/signals',
  },
].filter(i => !i.hide);
