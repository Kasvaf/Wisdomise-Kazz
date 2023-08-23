import { ReactComponent as AssetOverviewIcon } from './icons/assetOverview.svg';
import { ReactComponent as ProductsCatalogIcon } from './icons/productsCatalog.svg';
import { ReactComponent as SignalsIcon } from './icons/signals.svg';

const MenuItems = [
  {
    category: 'Passive Income',
    icon: <AssetOverviewIcon />,
    text: 'Asset Overview',
    mobileText: 'Asset',
    link: 'app/assets',
  },
  {
    category: 'Passive Income',
    icon: <ProductsCatalogIcon />,
    text: 'Products Catalog',
    mobileText: 'Products',
    link: 'app/products-catalog',
  },
  {
    category: 'Market Predication',
    icon: <SignalsIcon />,
    text: 'Signal Matrix',
    mobileText: 'Signals',
    link: 'app/signals',
  },
];

export default MenuItems;
