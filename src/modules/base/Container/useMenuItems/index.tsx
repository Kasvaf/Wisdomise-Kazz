/* eslint-disable import/max-dependencies */

import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  mobileHide?: boolean;
}

const useMenuItems = () => {
  const { t } = useTranslation();
  const DashboardMenuItems: MenuItem[] = [
    {
      category: t('base.menu.category.passive-income'),
      icon: <AssetOverviewIcon />,
      text: t('base.menu.asset-overview.title'),
      mobileText: t('base.menu.asset-overview.mobile'),
      link: '/app/assets',
    },
    {
      category: t('base.menu.category.passive-income'),
      icon: <ProductsCatalogIcon />,
      text: t('base.menu.products-catalog.title'),
      mobileText: t('base.menu.products-catalog.mobile'),
      link: '/app/products-catalog',
    },
    {
      category: t('base.menu.category.market-predication'),
      icon: <SignalsIcon />,
      text: t('base.menu.signal-matrix.title'),
      mobileText: t('base.menu.signal-matrix.mobile'),
      link: '/app/signals',
      hide: false,
    },
    {
      category: t('base.menu.category.strategy-builder'),
      icon: <StrategiesIcon />,
      text: t('base.menu.strategies.title'),
      mobileText: t('base.menu.strategies.mobile'),
      link: '/app/strategy',
      hide: isProduction,
      mobileHide: true,
    },
  ];

  const AccountMenuItems: MenuItem[] = [
    {
      category: t('base.menu.category.account'),
      text: t('base.menu.profile.title'),
      mobileText: t('base.menu.profile.mobile'),
      icon: <ProfileIcon />,
      link: '/account/profile',
    },
    {
      category: t('base.menu.category.account'),
      text: t('base.menu.account-manager.title'),
      mobileText: t('base.menu.account-manager.mobile'),
      icon: <ExchangeAccountIcon />,
      link: '/account/exchange-accounts',
      hide: isProduction,
    },
    {
      category: t('base.menu.category.account'),
      text: t('base.menu.billing.title'),
      mobileText: t('base.menu.billing.mobile'),
      icon: <BillingIcon />,
      link: '/account/billing',
    },
    {
      category: t('base.menu.category.account'),
      text: t('base.menu.referral.title'),
      mobileText: t('base.menu.referral.mobile'),
      icon: <ReferralIcon />,
      link: '/account/referral',
    },
    {
      category: t('base.menu.category.account'),
      text: t('base.menu.kyc.title'),
      mobileText: t('base.menu.kyc.mobile'),
      icon: <KYCIcon />,
      link: '/account/kyc',
    },
    {
      category: t('base.menu.category.account'),
      text: t('base.menu.notification-center.title'),
      mobileText: t('base.menu.notification-center.mobile'),
      icon: <NotificationIcon />,
      link: '/account/notification-center',
    },
  ];

  const { pathname } = useLocation();
  const isAccount = pathname.startsWith('/account');
  const items = isAccount ? AccountMenuItems : DashboardMenuItems;

  return {
    items: items.filter(x => !x.hide),
    hasExternals: isAccount,
  };
};

export default useMenuItems;
