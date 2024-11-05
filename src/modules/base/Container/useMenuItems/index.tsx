import { useTranslation } from 'react-i18next';
import { trackClick } from 'config/segment';
import { isMiniApp } from 'utils/version';
import { ReactComponent as IconDashboard } from './icons/dashboard.svg';
import { ReactComponent as IconMarketplace } from './icons/marketplace.svg';
import { ReactComponent as IconInsight } from './icons/insight.svg';
import { ReactComponent as IconAccount } from './icons/account.svg';
import { ReactComponent as IconHome } from './icons/home.svg';
import { ReactComponent as IconClaim } from './icons/claim.svg';

export interface MenuItem {
  text: string;
  link: string;
  hide?: boolean;
  badge?: 'beta' | 'new';
  mobileHide?: boolean;
  onClick?: () => void;
}

export interface RootMenuItem extends MenuItem {
  icon: JSX.Element;
  children?: MenuItem[];
}

const useMenuItems = () => {
  const { t } = useTranslation('base');
  const items: RootMenuItem[] = isMiniApp
    ? [
        {
          icon: <IconHome />,
          text: 'Auto Trader',
          link: '/hot-coins',
        },
        {
          icon: <IconClaim />,
          text: 'Claim Reward',
          link: '/claim-reward',
        },
      ]
    : [
        {
          icon: <IconDashboard />,
          text: t('menu.dashboard.title'),
          link: '/dashboard',
          onClick: trackClick('dashboard_menu'),
          children: [
            {
              text: t('menu.overview.title'),
              link: '/dashboard/overview',
              onClick: trackClick('dashboard_menu'),
            },
            {
              text: t('menu.portfolio.title'),
              link: '/dashboard/portfolio',
              onClick: trackClick('portfolio_menu'),
            },
          ],
        },
        {
          icon: <IconInsight />,
          text: t('menu.coin-radar.title'),
          link: '/coin-radar',
          onClick: trackClick('insight_menu'),
          children: [
            {
              text: t('menu.overview.title'),
              link: '/coin-radar/overview',
              onClick: trackClick('insight_menu'),
            },
            {
              text: t('menu.hot-coins.title'),
              link: '/coin-radar/social-radar',
              onClick: trackClick('coin_radar_menu'),
            },
            {
              text: t('menu.ai-indicators.title'),
              link: '/coin-radar/technical-radar',
              onClick: trackClick('market_pulse_menu'),
              badge: 'new',
            },
            {
              text: t('menu.whales.title'),
              link: '/coin-radar/whale-radar',
              onClick: trackClick('whales_menu'),
              badge: 'beta',
            },
            {
              text: t('menu.alerts.title'),
              link: '/coin-radar/alerts',
              onClick: trackClick('alerts_menu'),
            },
          ],
        },
        {
          icon: <IconMarketplace />,
          text: t('menu.investment.title'),
          link: '/marketplace',
          onClick: trackClick('marketplace_menu'),
          children: [
            {
              text: t('menu.overview.title'),
              link: '/marketplace/overview',
              onClick: trackClick('marketplace_menu'),
            },
            {
              text: t('menu.signalers.title'),
              link: '/marketplace/signalers',
              onClick: trackClick('signalers_menu'),
            },
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
          icon: <IconAccount />,
          text: t('menu.account.title'),
          link: '/account',
          onClick: trackClick('account_menu'),
          mobileHide: true,
          children: [
            {
              text: t('menu.overview.title'),
              link: '/account/overview',
              onClick: trackClick('account_menu'),
            },
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
