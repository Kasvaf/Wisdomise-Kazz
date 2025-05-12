import { type FC, useMemo } from 'react';
import { type AppRouteMeta } from 'modules/app/lib';
import { ReactComponent as PortfolioIcon } from './icons/portfolio.svg';
import { ReactComponent as CoinRadarIcon } from './icons/home.svg';
import { ReactComponent as SocialRadarIcon } from './icons/social.svg';
import { ReactComponent as TechnicalRadarIcon } from './icons/technical.svg';
import { ReactComponent as WhaleRadarIcon } from './icons/whale.svg';
import { ReactComponent as NetworkRadarIcon } from './icons/trench.svg';
interface MenuItem {
  link: string;
  meta: Partial<AppRouteMeta>;
  icon: FC<{ className?: string }>;
  text: string;
  crumb: string;
  hide?: boolean;
}

export const useMenuItems = () => {
  return useMemo<MenuItem[]>(
    () => [
      {
        link: '/app?list=portfolio',
        meta: {
          list: 'portfolio',
        },
        icon: PortfolioIcon,
        text: 'Portfolio',
        crumb: 'Portfolio',
      },
      {
        link: '/app?list=coin-radar',
        meta: {
          list: 'coin-radar',
        },
        icon: CoinRadarIcon,
        text: 'Radar+',
        crumb: 'Radar+',
      },
      {
        link: '/app?list=network-radar',
        meta: {
          list: 'network-radar',
        },
        icon: NetworkRadarIcon,
        text: 'Trench',
        crumb: 'Trench',
      },
      {
        link: '/app?list=social-radar',
        meta: {
          list: 'social-radar',
        },
        icon: SocialRadarIcon,
        text: 'Social',
        crumb: 'Social Radar',
      },
      {
        link: '/app?list=technical-radar',
        meta: {
          list: 'technical-radar',
        },
        icon: TechnicalRadarIcon,
        text: 'Technical',
        crumb: 'Technical Radar',
      },
      {
        link: '/app?list=whale-radar',
        meta: {
          list: 'whale-radar',
        },
        icon: WhaleRadarIcon,
        text: 'Whale',
        crumb: 'Whale Radar',
      },
    ],
    [],
  );
};
