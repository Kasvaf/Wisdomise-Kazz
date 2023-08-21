import { ReactComponent as AssetOverviewIcon } from './icons/assetOverview.svg';
import { ReactComponent as ProductsCatalogIcon } from './icons/productsCatalog.svg';
import { ReactComponent as SignalsIcon } from './icons/signals.svg';

const MenuItems = [
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

export default MenuItems;
