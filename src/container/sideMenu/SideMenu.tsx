import { NavLink } from "react-router-dom";
import DashboardIcon from "./icons/dashboard.svg";
import ProductCatalogICon from "./icons/productCatalog.svg";

import Logo from "./icons/logo.svg";

export const sideMeuWidth = 16; //rem

export const SideMenu = () => {
  return (
    <div className={`fixed ml-6 mt-6 flex w-[260px] flex-col`}>
      <div className="flex w-full cursor-pointer flex-row items-center justify-center">
        <img className="h-8" src={Logo} alt="logo" />
      </div>
      <div className="mt-6 h-[calc(100vh-92px)] w-full rounded-3xl bg-[#FFFFFF0D] p-6 ">
        {items.map((i) => (
          <NavLink
            key={i.link}
            to={i.link}
            className="mb-4 flex cursor-pointer justify-start rounded-full p-4 text-sm hover:bg-[#FFFFFF0D] [&.active]:bg-[#FFFFFF1A]"
          >
            <img src={i.icon} alt="logo" />
            <p className="ml-2 text-white">{i.text}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const items = [
  {
    icon: DashboardIcon,
    text: "Dashboard",
    link: "app/dashboard",
  },
  {
    icon: ProductCatalogICon,
    text: "Product Catalog",
    link: "app/products-catalog",
  },
];
