import { useLocation } from 'react-router-dom';
import { ReactComponent as AssetOverviewIcon } from './icons/assetOverview.svg';
import { ReactComponent as ProductsCatalogIcon } from './icons/productsCatalog.svg';
import { ReactComponent as SignalsIcon } from './icons/signals.svg';
import { ReactComponent as ReferralIcon } from './icons/referral.svg';
import { ReactComponent as ProfileIcon } from './icons/profile.svg';
import { ReactComponent as KYCIcon } from './icons/kyc.svg';

interface MenuItem {
  category: string;
  icon: JSX.Element;
  text: string;
  mobileText?: string;
  link: string;
  hide?: boolean;
}

const DashboardMenuItems: MenuItem[] = [
  {
    category: 'Passive Income',
    icon: <AssetOverviewIcon />,
    text: 'Asset Overview',
    mobileText: 'Asset',
    link: '/app/assets',
  },
  {
    category: 'Passive Income',
    icon: <ProductsCatalogIcon />,
    text: 'Products Catalog',
    mobileText: 'Products',
    link: '/app/products-catalog',
  },
  {
    category: 'Market Predication',
    icon: <SignalsIcon />,
    text: 'Signal Matrix',
    mobileText: 'Signals',
    link: '/app/signals',
    hide: false,
  },
];

const AccountMenuItems: MenuItem[] = [
  {
    category: 'Account',
    text: 'Profile',
    icon: <ProfileIcon />,
    link: '/account/profile',
  },
  {
    category: 'Account',
    text: 'Referral',
    icon: <ReferralIcon />,
    link: '/account/referral',
  },
  {
    category: 'Account',
    text: 'KYC',
    icon: <KYCIcon />,
    link: '/account/kyc',
  },
];

const useMenuItems = () => {
  const { pathname } = useLocation();
  const items = pathname.startsWith('/account')
    ? AccountMenuItems
    : DashboardMenuItems;

  return items.filter(x => !x.hide);
};

export default useMenuItems;
