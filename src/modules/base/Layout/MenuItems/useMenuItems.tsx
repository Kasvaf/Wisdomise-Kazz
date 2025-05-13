import { type FC, useMemo } from 'react';
import { type AppRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
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
        link: '/?list=portfolio',
        meta: {
          list: 'portfolio',
        },
        icon: PortfolioIcon,
        text: 'Portfolio',
        crumb: 'Portfolio',
      },
      {
        link: '/?list=coin-radar',
        meta: {
          list: 'coin-radar',
        },
        icon: CoinRadarIcon,
        text: 'Radar+',
        crumb: 'Radar+',
      },
      {
        link: '/?list=network-radar',
        meta: {
          list: 'network-radar',
        },
        icon: NetworkRadarIcon,
        text: 'Trench',
        crumb: 'Trench',
      },
      {
        link: '/?list=social-radar',
        meta: {
          list: 'social-radar',
        },
        icon: SocialRadarIcon,
        text: 'Social',
        crumb: 'Social Radar',
      },
      {
        link: '/?list=technical-radar',
        meta: {
          list: 'technical-radar',
        },
        icon: TechnicalRadarIcon,
        text: 'Technical',
        crumb: 'Technical Radar',
      },
      {
        link: '/?list=whale-radar',
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
