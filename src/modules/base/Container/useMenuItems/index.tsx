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
import { ReactComponent as TokenIcon } from './icons/token.svg';

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
  const { t } = useTranslation('base');
  const DashboardMenuItems: MenuItem[] = [
    {
      category: t('menu.category.passive-income'),
      icon: <AssetOverviewIcon />,
      text: t('menu.asset-overview.title'),
      mobileText: t('menu.asset-overview.mobile'),
      link: '/app/assets',
    },
    {
      category: t('menu.category.passive-income'),
      icon: <ProductsCatalogIcon />,
      text: t('menu.products-catalog.title'),
      mobileText: t('menu.products-catalog.mobile'),
      link: '/app/products-catalog',
    },
    {
      category: t('menu.category.market-predication'),
      icon: <SignalsIcon />,
      text: t('menu.signal-matrix.title'),
      mobileText: t('menu.signal-matrix.mobile'),
      link: '/app/signals',
      hide: false,
    },
    {
      category: t('menu.category.strategy-builder'),
      icon: <StrategiesIcon />,
      text: t('menu.strategies.title'),
      mobileText: t('menu.strategies.mobile'),
      link: '/app/strategy',
      hide: isProduction,
      mobileHide: true,
    },
  ];

  const AccountMenuItems: MenuItem[] = [
    {
      category: t('menu.category.account'),
      text: t('menu.profile.title'),
      mobileText: t('menu.profile.mobile'),
      icon: <ProfileIcon />,
      link: '/account/profile',
    },
    {
      category: t('menu.category.account'),
      text: t('menu.account-manager.title'),
      mobileText: t('menu.account-manager.mobile'),
      icon: <ExchangeAccountIcon />,
      link: '/account/exchange-accounts',
      hide: isProduction,
    },
    {
      category: t('menu.category.account'),
      text: t('menu.billing.title'),
      mobileText: t('menu.billing.mobile'),
      icon: <BillingIcon />,
      link: '/account/billing',
    },
    {
      category: t('menu.category.account'),
      text: t('menu.referral.title'),
      mobileText: t('menu.referral.mobile'),
      icon: <ReferralIcon />,
      link: '/account/referral',
    },
    {
      category: t('menu.category.account'),
      text: t('menu.kyc.title'),
      mobileText: t('menu.kyc.mobile'),
      icon: <KYCIcon />,
      link: '/account/kyc',
    },
    {
      category: t('menu.category.account'),
      text: t('menu.notification-center.title'),
      mobileText: t('menu.notification-center.mobile'),
      icon: <NotificationIcon />,
      link: '/account/notification-center',
    },
    {
      category: t('menu.category.account'),
      text: t('menu.token.title'),
      mobileText: t('menu.token.mobile'),
      icon: <TokenIcon />,
      link: '/account/token',
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
