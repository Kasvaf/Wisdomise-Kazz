import type { DiscoveryParams } from 'modules/discovery/lib';
import { type FC, useMemo } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as CoinRadarIcon } from './icons/home.svg';
import { ReactComponent as PortfolioIcon } from './icons/portfolio.svg';
import { ReactComponent as PositionsIcon } from './icons/positions.svg';
import { ReactComponent as SocialRadarIcon } from './icons/social.svg';
import { ReactComponent as TechnicalRadarIcon } from './icons/technical.svg';
import { ReactComponent as NetworkRadarIcon } from './icons/trench.svg';
import { ReactComponent as TwitterTrackerIcon } from './icons/twitter-tracker.svg';
import { ReactComponent as WhaleRadarIcon } from './icons/whale.svg';

interface MenuItem {
  link: string;
  meta: Required<Pick<DiscoveryParams, 'list'>>;
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
        link: '/trench',
        meta: {
          list: 'trench',
        },
        icon: NetworkRadarIcon,
        text: 'Trench',
        crumb: 'Trench',
      },
      {
        link: '/blue-chips',
        meta: {
          list: 'blue-chips',
        },
        icon: CoinRadarIcon,
        text: 'Bluechips',
        crumb: 'Bluechips',
      },
      {
        link: '/whale-radar',
        meta: {
          list: 'whale-radar',
        },
        icon: WhaleRadarIcon,
        text: 'Whale',
        crumb: 'Whale Radar',
      },
      {
        link: '/social-radar',
        meta: {
          list: 'social-radar',
        },
        icon: SocialRadarIcon,
        text: 'Social',
        crumb: 'Social Radar',
      },
      {
        link: '/technical-radar',
        meta: {
          list: 'technical-radar',
        },
        icon: TechnicalRadarIcon,
        text: 'Technical',
        crumb: 'Technical Radar',
      },
      {
        link: '/portfolio',
        meta: {
          list: 'portfolio',
        },
        icon: PortfolioIcon,
        text: 'Portfolio',
        crumb: 'Portfolio',
      },
      {
        link: '/positions',
        meta: {
          list: 'positions',
        },
        icon: PositionsIcon,
        text: 'Positions',
        crumb: 'Positions',
        hide: isMobile,
      },
      {
        link: '/twitter-tracker',
        meta: {
          list: 'twitter-tracker',
        },
        icon: TwitterTrackerIcon,
        text: 'X Tracker',
        crumb: 'X Tracker',
        hide: isMobile,
      },
    ],
    [isMobile],
  );
};
