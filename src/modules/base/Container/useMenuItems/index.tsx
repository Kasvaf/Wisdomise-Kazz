/* eslint-disable import/max-dependencies */

import { useLocation } from 'react-router-dom';
import { isProduction } from 'utils/version';
import { ReactComponent as AssetOverviewIcon } from './icons/assetOverview.svg';
import { ReactComponent as ProductsCatalogIcon } from './icons/productsCatalog.svg';
import { ReactComponent as SignalsIcon } from './icons/signals.svg';
import { ReactComponent as ReferralIcon } from './icons/referral.svg';
import { ReactComponent as ExchangeAccountIcon } from './icons/exchangeAccount.svg';
import { ReactComponent as ProfileIcon } from './icons/profile.svg';
import { ReactComponent as KYCIcon } from './icons/kyc.svg';
import { ReactComponent as NotificationIcon } from './icons/notification.svg';
import { ReactComponent as BillingIcon } from './icons/billing.svg';
import { ReactComponent as StrategiesIcon } from './icons/strategies.svg';

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
  {
    category: 'Developer',
    icon: <StrategiesIcon />,
    text: 'Strategies',
    mobileText: 'Strategies',
    link: '/app/strategy',
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
    text: 'Account Manager',
    icon: <ExchangeAccountIcon />,
    link: '/account/exchange-accounts',
  },
  {
    category: 'Account',
    text: 'Billing',
    icon: <BillingIcon />,
    link: '/account/billing',
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
  {
    category: 'Account',
    text: 'Notification Center',
    mobileText: 'Notifications',
    icon: <NotificationIcon />,
    link: '/account/notification-center',
    hide: isProduction,
  },
];

const useMenuItems = () => {
  const { pathname } = useLocation();
  const isAccount = pathname.startsWith('/account');
  const items = isAccount ? AccountMenuItems : DashboardMenuItems;

  return {
    items: items.filter(x => !x.hide),
    hasExternals: isAccount,
  };
};

export default useMenuItems;
