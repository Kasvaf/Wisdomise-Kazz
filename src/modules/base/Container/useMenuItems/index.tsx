/* eslint-disable import/max-dependencies */

import { useTranslation } from 'react-i18next';
import { trackClick } from 'config/segment';
import { ReactComponent as IconDashboard } from './icons/dashboard.svg';
import { ReactComponent as IconMarketplace } from './icons/marketplace.svg';
import { ReactComponent as IconInsight } from './icons/insight.svg';
import { ReactComponent as IconAccount } from './icons/account.svg';

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
      icon: <IconDashboard />,
      text: t('menu.dashboard.title'),
      link: '/dashboard',
      children: [
        {
          text: t('menu.overview.title'),
          link: '/dashboard/home',
          onClick: trackClick('home_menu'),
        },
        {
          text: t('menu.portfolio.title'),
          link: '/dashboard/portfolio',
          onClick: trackClick('portfolio_menu'),
        },
      ],
    },

    {
      icon: <IconMarketplace />,
      text: t('menu.marketplace.title'),
      link: '/marketplace',
      onClick: trackClick('investment_menu'),
      children: [
        {
          text: t('menu.financial-products.title'),
          link: '/marketplace/products-catalog',
          onClick: trackClick('financial_products_menu'),
        },
        {
          text: t('menu.builder.title'),
          link: '/marketplace/builder',
          onClick: trackClick('builder_menu'),
        },
      ],
    },
    {
      icon: <IconInsight />,
      text: t('menu.insight.title'),
      link: '/insight',
      onClick: trackClick('insight_menu'),
      children: [
        {
          text: t('menu.coin-radar.title'),
          link: '/insight/coin-radar',
          onClick: trackClick('coin_radar_menu'),
          isBeta: true,
        },
        {
          text: t('menu.market-pulse.title'),
          link: '/insight/market-pulse',
          onClick: trackClick('market_pulse_menu'),
          isBeta: true,
        },
        {
          text: t('menu.signalers.title'),
          link: '/insight/signalers',
          onClick: trackClick('signalers_menu'),
        },
        {
          text: t('menu.athena.title'),
          link: '/insight/athena',
          onClick: trackClick('crypto_chatbot_menu'),
        },
      ],
    },
    {
      icon: <IconAccount />,
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
