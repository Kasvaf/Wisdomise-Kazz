/* eslint-disable import/max-dependencies */

import { useTranslation } from 'react-i18next';
import { trackClick } from 'config/segment';
import { ReactComponent as InvestmentIconEmpty } from './icons/investment-empty.svg';
import { ReactComponent as InvestmentIconFull } from './icons/investment-full.svg';
import { ReactComponent as InsightIconEmpty } from './icons/insight-empty.svg';
import { ReactComponent as InsightIconFull } from './icons/insight-full.svg';
import { ReactComponent as AccountIconEmpty } from './icons/account-empty.svg';
import { ReactComponent as AccountIconFull } from './icons/account-full.svg';
import { ReactComponent as BuilderIconEmpty } from './icons/builder-empty.svg';
import { ReactComponent as BuilderIconFull } from './icons/builder-full.svg';
import { ReactComponent as HomeIconFull } from './icons/home-full.svg';
import { ReactComponent as HomeIconEmpty } from './icons/home-empty.svg';

const Icon = (
  Empty: React.FC<React.SVGProps<SVGSVGElement>>,
  Full: React.FC<React.SVGProps<SVGSVGElement>>,
) => (
  <div>
    <Empty className="block group-[.active]:hidden" />
    <Full className="hidden group-[.active]:block" />
  </div>
);

interface MenuItem {
  text: string;
  link: string;
  hide?: boolean;
  isBeta?: boolean;
  mobileHide?: boolean;
  onClick?: () => void;
}

export interface RootMenuItem extends MenuItem {
  icon: JSX.Element;
  children?: MenuItem[];
}

const useMenuItems = () => {
  const { t } = useTranslation('base');
  const items: RootMenuItem[] = [
    {
      icon: Icon(HomeIconEmpty, HomeIconFull),
      text: t('menu.home.title'),
      link: '/home',
      onClick: trackClick('home_menu'),
    },

    {
      icon: Icon(InsightIconEmpty, InsightIconFull),
      text: t('menu.insight.title'),
      link: '/insight',
      onClick: trackClick('insight_menu'),
      children: [
        {
          text: t('menu.signal-matrix.title'),
          link: '/insight/signals',
          onClick: trackClick('signal_matrix_menu'),
        },
        {
          text: t('menu.coin-view.title'),
          link: '/insight/coins',
          onClick: trackClick('coin_list_menu'),
        },
        {
          text: t('menu.athena.title'),
          link: '/insight/athena',
          onClick: trackClick('crypto_chatbot_menu'),
        },
        {
          text: t('menu.social-radar.title'),
          link: '/insight/social-radar',
          onClick: trackClick('social_radar_menu'),
          isBeta: true,
        },
      ],
    },
    {
      icon: Icon(InvestmentIconEmpty, InvestmentIconFull),
      text: t('menu.investment.title'),
      link: '/investment',
      onClick: trackClick('investment_menu'),
      children: [
        {
          text: t('menu.asset-overview.title'),
          link: '/investment/assets',
          onClick: trackClick('asset_overview_menu'),
        },
        {
          text: t('menu.financial-products.title'),
          link: '/investment/products-catalog',
          onClick: trackClick('financial_products_menu'),
        },
      ],
    },
    {
      icon: Icon(BuilderIconEmpty, BuilderIconFull),
      text: t('menu.builder.title'),
      link: '/builder',
      mobileHide: true,
      children: [
        {
          text: t('menu.signal-builder.title'),
          link: '/builder/signalers',
          onClick: trackClick('builder_signals_menu'),
        },
        {
          text: t('menu.fp-builder.title'),
          link: '/builder/fp',
          onClick: trackClick('builder_fp_menu'),
        },
      ],
    },
    {
      icon: Icon(AccountIconEmpty, AccountIconFull),
      text: t('menu.account.title'),
      link: '/account',
      onClick: trackClick('account_menu'),
      children: [
        {
          text: t('menu.profile.title'),
          link: '/account/profile',
          onClick: trackClick('profile_menu'),
        },
        {
          text: t('menu.billing.title'),
          link: '/account/billing',
          onClick: trackClick('subscription_menu'),
        },
        {
          text: t('menu.kyc.title'),
          link: '/account/kyc',
          onClick: trackClick('kyc_menu'),
        },
        {
          text: t('menu.token.title'),
          link: '/account/token',
          onClick: trackClick('wsdm_token_menu'),
        },
        {
          text: t('menu.account-manager.title'),
          link: '/account/exchange-accounts',
          onClick: trackClick('external_account_menu'),
        },
        {
          text: t('menu.notification-center.title'),
          link: '/account/notification-center',
          onClick: trackClick('notifications_menu'),
        },
        {
          text: t('menu.referral.title'),
          link: '/account/referral',
          onClick: trackClick('referral_menu'),
        },
      ],
    },
  ];
  return { items };
};

export default useMenuItems;
