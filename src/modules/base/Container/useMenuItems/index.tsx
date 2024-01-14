/* eslint-disable import/max-dependencies */

import { useTranslation } from 'react-i18next';
import { isProduction } from 'utils/version';
import { ReactComponent as InvestmentIconEmpty } from './icons/investment-empty.svg';
import { ReactComponent as InvestmentIconFull } from './icons/investment-full.svg';
import { ReactComponent as InsightIconEmpty } from './icons/insight-empty.svg';
import { ReactComponent as InsightIconFull } from './icons/insight-full.svg';
import { ReactComponent as AccountIconEmpty } from './icons/account-empty.svg';
import { ReactComponent as AccountIconFull } from './icons/account-full.svg';
import { ReactComponent as StrategiesIcon } from './icons/strategies.svg';

const Icon = (
  Empty: React.FC<React.SVGProps<SVGSVGElement>>,
  Full: React.FC<React.SVGProps<SVGSVGElement>>,
) => (
  <div>
    <Empty className="block group-[.active]:hidden" />
    <Full className="hidden group-[.active]:block" />
  </div>
);

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
      icon: Icon(InvestmentIconEmpty, InvestmentIconFull),
      text: t('menu.investment.title'),
      link: '/investment',
      children: [
        {
          text: t('menu.asset-overview.title'),
          link: '/investment/assets',
        },
        {
          text: t('menu.financial-products.title'),
          link: '/investment/products-catalog',
        },
      ],
    },
    {
      icon: Icon(InsightIconEmpty, InsightIconFull),
      text: t('menu.insight.title'),
      link: '/insight',
      children: [
        {
          text: t('menu.signal-matrix.title'),
          link: '/insight/signals',
        },
        {
          text: t('menu.athena.title'),
          link: '/insight/athena',
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
      icon: Icon(AccountIconEmpty, AccountIconFull),
      text: t('menu.account.title'),
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
