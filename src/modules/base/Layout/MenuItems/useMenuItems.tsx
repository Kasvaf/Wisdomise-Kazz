import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as PortfolioIcon } from './icons/portfolio.svg';
import { ReactComponent as CoinRadarIcon } from './icons/home.svg';
import { ReactComponent as SocialRadarIcon } from './icons/social.svg';
import { ReactComponent as TechnicalRadarIcon } from './icons/technical.svg';
import { ReactComponent as WhaleRadarIcon } from './icons/whale.svg';
import { ReactComponent as NetworkRadarIcon } from './icons/trench.svg';

export const MENU_ITEMS = [
  'portfolio',
  'coin-radar',
  'network-radar',
  'social-radar',
  'technical-radar',
  'whale-radar',
] as const;
interface MenuItem {
  key: (typeof MENU_ITEMS)[number];
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
        link: '/discovery?list=portfolio',
        hide: true,
      },
      {
        key: 'coin-radar',
        icon: CoinRadarIcon,
        text: t('menu.home.title'),
        link: '/discovery?list=coin-radar',
      },
      {
        key: 'network-radar',
        icon: NetworkRadarIcon,
        text: t('menu.trench.title'),
        link: '/discovery?list=network-radar',
      },
      {
        key: 'social-radar',
        icon: SocialRadarIcon,
        text: t('menu.social.title'),
        link: '/discovery?list=social-radar',
      },
      {
        key: 'technical-radar',
        icon: TechnicalRadarIcon,
        text: t('menu.technical.title'),
        link: '/discovery?list=technical-radar',
      },
      {
        key: 'whale-radar',
        icon: WhaleRadarIcon,
        text: t('menu.whale.title'),
        link: '/discovery?list=whale-radar',
      },
    ],
    [t],
  );
};
