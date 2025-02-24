import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { trackClick } from 'config/segment';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as IconPositions } from './icons/positions.svg';
import { ReactComponent as IconInsight } from './icons/insight.svg';
import { ReactComponent as IconAccount } from './icons/account.svg';
import { ReactComponent as IconQuests } from './icons/quests.svg';
import { ReactComponent as IconHome } from './icons/home.svg';

interface MenuItem {
  text: string;
  link: string;
  hide?: boolean;
  badge?: 'beta' | 'new';
  onClick?: () => void;
}

export interface RootMenuItem extends MenuItem {
  icon: JSX.Element;
  children?: MenuItem[];
}

const useMenuItems = () => {
  const { t } = useTranslation('base');
  const isMobile = useIsMobile();

  const { pathname } = useLocation();

  const items: RootMenuItem[] = [
    {
      icon: isMobile ? <IconHome /> : <IconInsight />,
      text: isMobile ? 'Home' : t('menu.coin-radar.title'),
      link: '/coin-radar/overview',
      onClick: trackClick('insight_menu'),
      children: [
        {
          text: t('menu.overview.title'),
          link: '/coin-radar/overview',
          onClick: trackClick('insight_menu'),
          badge: 'beta',
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
        },
        {
          text: t('menu.whales.title'),
          link: '/coin-radar/whale-radar',
          onClick: trackClick('whales_menu'),
        },
        {
          text: t('menu.alerts.title'),
          link: '/coin-radar/alerts',
          onClick: trackClick('alerts_menu'),
        },
      ],
    },
    {
      icon: <IconInsight />,
      text: 'Radars',
      link:
        (pathname.startsWith('/coin-radar/') &&
          !pathname.startsWith('/coin-radar/overview') &&
          /\/coin-radar\/[\w-]+/.exec(pathname)?.[0]) ||
        '/coin-radar/social-radar',
      hide: !isMobile,
    },
    {
      icon: <IconPositions />,
      text: isMobile ? 'Trades' : 'Auto Trader',
      link: '/trader-positions',
    },
    {
      icon: <IconQuests />,
      text: 'Quest',
      link: '/trader-quests',
      hide: !isMobile,
    },
    {
      icon: <IconAccount />,
      text: t('menu.account.title'),
      link: '/account',
      onClick: trackClick('account_menu'),
      hide: isMobile,
      children: [
        {
          text: isMobile ? t('menu.account.title') : t('menu.overview.title'),
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
          text: t('menu.referral.title'),
          link: '/account/referral',
          onClick: trackClick('referral_menu'),
        },
        {
          text: t('menu.rewards.title'),
          link: '/account/rewards',
          onClick: trackClick('rewards_menu'),
          hide: !isMobile,
        },
      ],
    },
  ];
  return { items };
};

export default useMenuItems;
