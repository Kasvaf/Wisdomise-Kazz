import clsx from 'clsx';
import { DOCS_ORIGIN } from 'config/constants';
import {
  type DiscoveryParams,
  useDiscoveryListPopups,
  useDiscoveryUrlParams,
} from 'modules/discovery/lib';
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHasFlag, useTraderPositionsQuery } from 'services/rest';
import { useLocalStorage } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as HelpIcon } from './icons/help.svg';
import { ReactComponent as CoinRadarIcon } from './icons/home.svg';
import { ReactComponent as LeagueIcon } from './icons/league.svg';
import { ReactComponent as MetaIcon } from './icons/meta.svg';
import { ReactComponent as PortfolioIcon } from './icons/portfolio.svg';
import { ReactComponent as PositionsIcon } from './icons/positions.svg';
import { ReactComponent as ReferralIcon } from './icons/referral.svg';
import { ReactComponent as RewardsIcon } from './icons/rewards.svg';
import { ReactComponent as SocialRadarIcon } from './icons/social.svg';
import { ReactComponent as TechnicalRadarIcon } from './icons/technical.svg';
import { ReactComponent as TrackerIcon } from './icons/tracker.svg';
import { ReactComponent as NetworkRadarIcon } from './icons/trench.svg';
import { ReactComponent as TwitterTrackerIcon } from './icons/twitter-tracker.svg';
import { ReactComponent as WalletTrackerIcon } from './icons/wallet-tracker.svg';
import { ReactComponent as WhaleRadarIcon } from './icons/whale.svg';

export interface MenuItem {
  isDisabled?: boolean;
  isActive?: boolean; // for when page rendered via exact url
  isSemiActive?: boolean; // for when the page shown as popup
  link: string;
  meta?: Required<Pick<DiscoveryParams, 'list'>>;
  icon: FC<{ className?: string }>;
  text: ReactNode;
  tour: null | boolean;
}

export const useHandleClickMenuItem = () => {
  const discoveryUrlParams = useDiscoveryUrlParams();
  const [_, toggleDiscoveryPopup] = useDiscoveryListPopups();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const isOnDiscoveryPages =
    !!discoveryUrlParams.detail || !!discoveryUrlParams.list;
  return useCallback(
    (item: MenuItem, asPopupIfPossible = false) => {
      if (
        asPopupIfPossible &&
        isOnDiscoveryPages &&
        item.meta?.list &&
        !isMobile
      ) {
        toggleDiscoveryPopup(item.meta);
      } else if (item.link.startsWith('https://')) {
        window.location.href = item.link;
      } else {
        navigate(item.link);
      }
    },
    [toggleDiscoveryPopup, navigate, isOnDiscoveryPages, isMobile],
  );
};

export const useMenuItems = () => {
  const { pathname } = useLocation();
  const hasFlag = useHasFlag();

  const { data } = useTraderPositionsQuery({ isOpen: true, enabled: false });
  const openTrades =
    data?.positions.filter(x => x.deposit_status !== 'PENDING').length ?? 0;
  const [maxOpenTrades, setMaxOpenTrade] = useLocalStorage(
    'max-open-trades',
    0,
  );
  useEffect(() => {
    setMaxOpenTrade(x => Math.max(x, openTrades));
  }, [openTrades, setMaxOpenTrade]);

  const hasClosedTrades = openTrades < maxOpenTrades;

  const [discoveryPopups] = useDiscoveryListPopups();
  const discoveryParams = useDiscoveryUrlParams();
  const isOnDiscoveryPages = !!discoveryParams.detail || !!discoveryParams.list;

  return useMemo(
    () => ({
      trench: {
        isDisabled: !hasFlag('/trench'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'trench',
        isSemiActive:
          isOnDiscoveryPages && discoveryPopups.some(x => x.list === 'trench'),
        link: '/trench',
        meta: {
          list: 'trench',
        },
        icon: NetworkRadarIcon,
        text: 'Trench',
        tour: null,
      } as MenuItem,
      bluechips: {
        isDisabled: !hasFlag('/bluechips'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'bluechips',
        isSemiActive:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'bluechips'),
        link: '/bluechips',
        meta: {
          list: 'bluechips',
        },
        icon: CoinRadarIcon,
        text: 'Bluechips',
        tour: null,
      } as MenuItem,
      whaleRadar: {
        isDisabled: !hasFlag('/whale-radar'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'whale-radar',
        isSemiActive:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'whale-radar'),
        link: '/whale-radar',
        meta: {
          list: 'whale-radar',
        },
        icon: WhaleRadarIcon,
        text: 'Whale',
        tour: null,
      } as MenuItem,
      socialRadar: {
        isDisabled: !hasFlag('/social-radar'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'social-radar',
        isSemiActive:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'social-radar'),
        link: '/social-radar',
        meta: {
          list: 'social-radar',
        },
        icon: SocialRadarIcon,
        text: 'Social',
        tour: null,
      } as MenuItem,
      technicalRadar: {
        isDisabled: !hasFlag('/technical-radar'),
        isActive:
          isOnDiscoveryPages && discoveryParams.list === 'technical-radar',
        isSemiActive:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'technical-radar'),
        link: '/technical-radar',
        meta: {
          list: 'technical-radar',
        },
        icon: TechnicalRadarIcon,
        text: 'Technical',
        tour: null,
      } as MenuItem,
      walletTracker: {
        isDisabled: !hasFlag('/wallet-tracker'),
        isActive:
          isOnDiscoveryPages && discoveryParams.list === 'wallet-tracker',
        isSemiActive:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'wallet-tracker'),
        link: '/wallet-tracker',
        meta: {
          list: 'wallet-tracker',
        },
        icon: WalletTrackerIcon,
        text: 'Wallet Tracker',
        tour: null,
      } as MenuItem,
      twitterTracker: {
        isDisabled: !hasFlag('/twitter-tracker'),
        isActive:
          isOnDiscoveryPages && discoveryParams.list === 'twitter-tracker',
        isSemiActive:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'twitter-tracker'),
        link: '/twitter-tracker',
        meta: {
          list: 'twitter-tracker',
        },
        icon: TwitterTrackerIcon,
        text: 'X Tracker',
        tour: null,
      } as MenuItem,
      metaTracker: {
        isDisabled: hasFlag('/meta'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'meta',
        isSemiActive:
          isOnDiscoveryPages && discoveryPopups.some(x => x.list === 'meta'),
        link: '/meta',
        meta: {
          list: 'meta',
        },
        icon: MetaIcon,
        text: 'Meta Tracker',
        tour: null,
      } as MenuItem,
      portfolio: {
        isDisabled: !hasFlag('/portfolio'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'portfolio',
        isSemiActive:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'portfolio'),
        link: '/portfolio',
        meta: {
          list: 'portfolio',
        },
        icon: PortfolioIcon,
        text: 'Portfolio',
        tour: null,
      } as MenuItem,
      positions: {
        isDisabled: !hasFlag('/positions'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'positions',
        isSemiActive:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'positions'),
        link: '/positions',
        meta: {
          list: 'positions',
        },
        icon: PositionsIcon,
        text: 'Positions',
        tour: null,
      } as MenuItem,
      league: {
        isDisabled: !hasFlag('/trader/quests/league'),
        isActive: pathname.startsWith('/trader/quests/league'),
        link: '/trader/quests/league',
        icon: LeagueIcon,
        text: 'League',
        tour: null,
      } as MenuItem,
      trades: {
        isDisabled: !hasFlag('/positions'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'positions',
        link: `/positions?filter=${hasClosedTrades && !openTrades ? 'history' : ''}`,
        icon: PositionsIcon,
        text: (
          <>
            Trades
            {openTrades > 0 && (
              <div
                className={clsx(
                  'rounded-full bg-v1-background-negative text-2xs text-white',
                  openTrades >= 10 ? 'size-2' : 'size-4',
                )}
              >
                {openTrades >= 10 ? '' : openTrades}
              </div>
            )}
          </>
        ),
        tour: hasClosedTrades,
      } as MenuItem,
      referral: {
        isDisabled: !hasFlag('/account/referral'),
        isActive: pathname.startsWith('/account/referral'),
        link: '/account/referral',
        icon: ReferralIcon,
        text: 'Referral Program',
        tour: null,
      } as MenuItem,
      trackers: {
        isDisabled: false,
        isActive: false,
        link: '/bluechips',
        icon: TrackerIcon,
        text: 'Trackers',
        tour: null,
      } as MenuItem,
      docs: {
        isDisabled: false,
        isActive: false,
        link: DOCS_ORIGIN,
        icon: HelpIcon,
        text: 'Docs',
        tour: null,
      } as MenuItem,
      rewards: {
        isDisabled: !hasFlag('/account/rewards'),
        isActive: pathname.startsWith('/account/rewards'),
        link: '/account/rewards',
        icon: RewardsIcon,
        text: 'Rewards',
        tour: null,
      } as MenuItem,
    }),
    [
      openTrades,
      hasClosedTrades,
      hasFlag,
      discoveryParams.list,
      pathname,
      isOnDiscoveryPages,
      discoveryPopups.some,
    ],
  );
};

/*
  // docs DOCS_ORIGIN
  rewards /account/rewards
  referral /*
    const { data: referral } = useReferralStatusQuery();

    return (
      <MenuItem to="/account/referral">
        <BoxedIcon icon={IconReferral} />
        {t('menu.referral.title')}

        {!Number.isNaN(referral?.referred_users_count) && referral != null && (
          <Badge color="info">
            {t('accounts:page-accounts.users_invited', {
              count: referral?.referred_users_count || 0,
            })}
          </Badge>
        )}
      </MenuItem>
    );
  (/)

*/
