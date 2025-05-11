import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type AVAILABLE_LISTS } from 'modules/discovery/lib';
import { ReactComponent as PortfolioIcon } from './icons/portfolio.svg';
import { ReactComponent as CoinRadarIcon } from './icons/home.svg';
import { ReactComponent as SocialRadarIcon } from './icons/social.svg';
import { ReactComponent as TechnicalRadarIcon } from './icons/technical.svg';
import { ReactComponent as WhaleRadarIcon } from './icons/whale.svg';
import { ReactComponent as NetworkRadarIcon } from './icons/trench.svg';
interface MenuItem {
  key: (typeof AVAILABLE_LISTS)[number];
  icon: FC<{ className?: string }>;
  text: string;
  link: string;
  hide?: boolean;
}

export const useMenuItems = () => {
  const { t } = useTranslation('base');

  return useMemo<MenuItem[]>(
    () => [
      {
        key: 'portfolio',
        icon: PortfolioIcon,
        text: t('menu.portfolio.title'),
        link: '/discovery/portfolio',
        hide: true,
      },
      {
        key: 'coin-radar',
        icon: CoinRadarIcon,
        text: t('menu.home.title'),
        link: '/discovery/coin-radar',
      },
      {
        key: 'network-radar',
        icon: NetworkRadarIcon,
        text: t('menu.trench.title'),
        link: '/discovery/network-radar',
      },
      {
        key: 'social-radar',
        icon: SocialRadarIcon,
        text: t('menu.social.title'),
        link: '/discovery/social-radar',
      },
      {
        key: 'technical-radar',
        icon: TechnicalRadarIcon,
        text: t('menu.technical.title'),
        link: '/discovery/technical-radar',
      },
      {
        key: 'whale-radar',
        icon: WhaleRadarIcon,
        text: t('menu.whale.title'),
        link: '/discovery/whale-radar',
      },
    ],
    [t],
  );
};
