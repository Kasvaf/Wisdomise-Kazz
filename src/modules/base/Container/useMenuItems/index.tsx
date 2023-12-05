/* eslint-disable import/max-dependencies */

import { useTranslation } from 'react-i18next';
import { isProduction } from 'utils/version';
import { ReactComponent as InvestmentIcon } from './icons/investment.svg';
import { ReactComponent as InsightIcon } from './icons/insight.svg';
import { ReactComponent as StrategiesIcon } from './icons/strategies.svg';
import { ReactComponent as AccountIcon } from './icons/account.svg';

export interface MenuItem {
  text: string;
  link: string;
  hide?: boolean;
  mobileHide?: boolean;
}

export interface RootMenuItem extends MenuItem {
  icon: JSX.Element;
  children?: MenuItem[];
}

const useMenuItems = () => {
  const { t } = useTranslation('base');
  const items: RootMenuItem[] = [
    {
      icon: <InvestmentIcon />,
      text: 'Investment',
      link: '/app/investment',
      children: [
        {
          text: t('menu.asset-overview.title'),
          link: '/app/assets',
        },
        {
          text: t('menu.financial-products.title'),
          link: '/app/products-catalog',
        },
      ],
    },
    {
      icon: <InsightIcon />,
      text: 'Insight',
      link: '/app/insight',
      children: [
        {
          text: t('menu.signal-matrix.title'),
          link: '/app/signals',
        },
      ],
    },
    {
      icon: <StrategiesIcon />,
      text: t('menu.strategies.title'),
      link: '/app/strategy',
      hide: isProduction,
      mobileHide: true,
    },
    {
      icon: <AccountIcon />,
      text: 'Account',
      link: '/account',
      children: [
        {
          text: t('menu.profile.title'),
          link: '/account/profile',
          mobileHide: true,
        },
        {
          text: t('menu.billing.title'),
          link: '/account/billing',
        },
        {
          text: t('menu.kyc.title'),
          link: '/account/kyc',
        },
        {
          text: t('menu.token.title'),
          link: '/account/token',
        },
        {
          text: t('menu.account-manager.title'),
          link: '/account/exchange-accounts',
        },
        {
          text: t('menu.notification-center.title'),
          link: '/account/notification-center',
        },
        {
          text: t('menu.referral.title'),
          link: '/account/referral',
        },
      ],
    },
  ];
  return { items };
};

export default useMenuItems;
