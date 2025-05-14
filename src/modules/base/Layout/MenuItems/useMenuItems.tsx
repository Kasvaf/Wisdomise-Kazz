import { type FC, useMemo } from 'react';
import { type DiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as PortfolioIcon } from './icons/portfolio.svg';
import { ReactComponent as CoinRadarIcon } from './icons/home.svg';
import { ReactComponent as SocialRadarIcon } from './icons/social.svg';
import { ReactComponent as TechnicalRadarIcon } from './icons/technical.svg';
import { ReactComponent as WhaleRadarIcon } from './icons/whale.svg';
import { ReactComponent as NetworkRadarIcon } from './icons/trench.svg';
interface MenuItem {
  link: string;
  meta: Partial<DiscoveryRouteMeta>;
  icon: FC<{ className?: string }>;
  text: string;
  crumb: string;
  hide?: boolean;
}

export const useMenuItems = () => {
  const isMobile = useIsMobile();

  return useMemo<MenuItem[]>(
    () => [
      {
        link: '/discovery?list=portfolio',
        meta: {
          list: 'portfolio',
        },
        icon: PortfolioIcon,
        text: 'Portfolio',
        crumb: 'Portfolio',
        hide: isMobile,
      },
      {
        link: '/discovery?list=coin-radar',
        meta: {
          list: 'coin-radar',
        },
        icon: CoinRadarIcon,
        text: 'Radar+',
        crumb: 'Radar+',
      },
      {
        link: '/discovery?list=network-radar',
        meta: {
          list: 'network-radar',
        },
        icon: NetworkRadarIcon,
        text: 'Trench',
        crumb: 'Trench',
      },
      {
        link: '/discovery?list=social-radar',
        meta: {
          list: 'social-radar',
        },
        icon: SocialRadarIcon,
        text: 'Social',
        crumb: 'Social Radar',
      },
      {
        link: '/discovery?list=technical-radar',
        meta: {
          list: 'technical-radar',
        },
        icon: TechnicalRadarIcon,
        text: 'Technical',
        crumb: 'Technical Radar',
      },
      {
        link: '/discovery?list=whale-radar',
        meta: {
          list: 'whale-radar',
        },
        icon: WhaleRadarIcon,
        text: 'Whale',
        crumb: 'Whale Radar',
      },
    ],
    [isMobile],
  );
};
