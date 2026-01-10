import { bxChevronDown } from 'boxicons-quasar';
import clsx from 'clsx';
import { DOCS_ORIGIN } from 'config/constants';
import {
  type DiscoveryParams,
  useDiscoveryListPopups,
  useDiscoveryUrlParams,
} from 'modules/discovery/lib';
import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AnimateHeight from 'react-animate-height';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHasFlag, useTraderPositionsQuery } from 'services/rest';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import Icon from 'shared/Icon';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
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

export interface MenuItemType {
  isDisabled?: boolean;
  isActive?: boolean; // for when page rendered via exact url
  isPopupOpen?: boolean; // for when the page shown as popup
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
    (item: MenuItemType, asPopupIfPossible = false) => {
      if (
        (asPopupIfPossible || item.isPopupOpen) &&
        !item.isActive &&
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
        isPopupOpen:
          isOnDiscoveryPages && discoveryPopups.some(x => x.list === 'trench'),
        link: '/trench',
        meta: {
          list: 'trench',
        },
        icon: NetworkRadarIcon,
        text: 'Trench',
        tour: null,
      } as MenuItemType,
      bluechips: {
        isDisabled: !hasFlag('/bluechips'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'bluechips',
        isPopupOpen:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'bluechips'),
        link: '/bluechips',
        meta: {
          list: 'bluechips',
        },
        icon: CoinRadarIcon,
        text: 'Bluechips',
        tour: null,
      } as MenuItemType,
      whaleRadar: {
        isDisabled: !hasFlag('/whale-radar'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'whale-radar',
        isPopupOpen:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'whale-radar'),
        link: '/whale-radar',
        meta: {
          list: 'whale-radar',
        },
        icon: WhaleRadarIcon,
        text: 'Whale',
        tour: null,
      } as MenuItemType,
      socialRadar: {
        isDisabled: !hasFlag('/social-radar'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'social-radar',
        isPopupOpen:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'social-radar'),
        link: '/social-radar',
        meta: {
          list: 'social-radar',
        },
        icon: SocialRadarIcon,
        text: 'Social',
        tour: null,
      } as MenuItemType,
      technicalRadar: {
        isDisabled: !hasFlag('/technical-radar'),
        isActive:
          isOnDiscoveryPages && discoveryParams.list === 'technical-radar',
        isPopupOpen:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'technical-radar'),
        link: '/technical-radar',
        meta: {
          list: 'technical-radar',
        },
        icon: TechnicalRadarIcon,
        text: 'Technical',
        tour: null,
      } as MenuItemType,
      walletTracker: {
        isDisabled: !hasFlag('/wallet-tracker'),
        isActive:
          isOnDiscoveryPages && discoveryParams.list === 'wallet-tracker',
        isPopupOpen:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'wallet-tracker'),
        link: '/wallet-tracker',
        meta: {
          list: 'wallet-tracker',
        },
        icon: WalletTrackerIcon,
        text: 'Wallet Tracker',
        tour: null,
      } as MenuItemType,
      twitterTracker: {
        isDisabled: !hasFlag('/twitter-tracker'),
        isActive:
          isOnDiscoveryPages && discoveryParams.list === 'twitter-tracker',
        isPopupOpen:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'twitter-tracker'),
        link: '/twitter-tracker',
        meta: {
          list: 'twitter-tracker',
        },
        icon: TwitterTrackerIcon,
        text: 'X Tracker',
        tour: null,
      } as MenuItemType,
      metaTracker: {
        isDisabled: !hasFlag('/meta'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'meta',
        isPopupOpen:
          isOnDiscoveryPages && discoveryPopups.some(x => x.list === 'meta'),
        link: '/meta',
        meta: {
          list: 'meta',
        },
        icon: MetaIcon,
        text: 'Meta Tracker',
        tour: null,
      } as MenuItemType,
      portfolio: {
        isDisabled: !hasFlag('/portfolio'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'portfolio',
        isPopupOpen:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'portfolio'),
        link: '/portfolio',
        meta: {
          list: 'portfolio',
        },
        icon: PortfolioIcon,
        text: 'Portfolio',
        tour: null,
      } as MenuItemType,
      positions: {
        isDisabled: !hasFlag('/positions'),
        isActive: isOnDiscoveryPages && discoveryParams.list === 'positions',
        isPopupOpen:
          isOnDiscoveryPages &&
          discoveryPopups.some(x => x.list === 'positions'),
        link: '/positions',
        meta: {
          list: 'positions',
        },
        icon: PositionsIcon,
        text: 'Positions',
        tour: null,
      } as MenuItemType,
      league: {
        isDisabled: !hasFlag('/trader/quests/league'),
        isActive: pathname.startsWith('/trader/quests/league'),
        link: '/trader/quests/league',
        icon: LeagueIcon,
        text: 'League',
        tour: null,
      } as MenuItemType,
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
      } as MenuItemType,
      referral: {
        isDisabled: !hasFlag('/account/referral'),
        isActive: pathname.startsWith('/account/referral'),
        link: '/account/referral',
        icon: ReferralIcon,
        text: 'Referral Program',
        tour: null,
      } as MenuItemType,
      trackers: {
        isDisabled: false,
        isActive: false,
        link: '/bluechips',
        icon: TrackerIcon,
        text: 'Trackers',
        tour: null,
      } as MenuItemType,
      docs: {
        isDisabled: false,
        isActive: false,
        link: DOCS_ORIGIN,
        icon: HelpIcon,
        text: 'Docs',
        tour: null,
      } as MenuItemType,
      rewards: {
        isDisabled: !hasFlag('/account/rewards'),
        isActive: pathname.startsWith('/account/rewards'),
        link: '/account/rewards',
        icon: RewardsIcon,
        text: 'Rewards',
        tour: null,
      } as MenuItemType,
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

export const MenuItem: FC<
  {
    value: MenuItemType;
    className?: string;
    asPopupIfPossible?: boolean;
    isActive?: boolean;
    children?: ReactNode;
  } & Omit<ButtonProps, 'value' | 'className' | 'children'>
> = ({
  value,
  asPopupIfPossible,
  className,
  isActive: _isActive,
  children,
  ...buttonProps
}) => {
  const isMobile = useIsMobile();
  const handleClickMenuItem = useHandleClickMenuItem();

  const isActive = value.isActive || _isActive;

  if (value.isDisabled) return null;

  return (
    <Button
      className={clsx(
        isActive && '!bg-v1-background-brand/10 !text-v1-content-brand',
        className,
      )}
      onClick={() => handleClickMenuItem(value, asPopupIfPossible)}
      size={isMobile ? 'md' : 'sm'}
      surface={0}
      variant="ghost"
      {...buttonProps}
    >
      <value.icon />
      {value.text}
      {value.isPopupOpen && (
        <span className="ms-1 block size-1 rounded-full bg-v1-content-brand" />
      )}
      {children && (
        <div className="flex w-full shrink grow justify-end">{children}</div>
      )}
    </Button>
  );
};

export const MenuItemGroup: FC<{
  button: MenuItemType;
  buttonProps?: Omit<ComponentProps<typeof MenuItem>, 'value'>;
  items: MenuItemType[];
  itemsProps?: Omit<ComponentProps<typeof MenuItem>, 'value'>;
  block?: boolean;
  blockProps?: { className?: string };
  chevron?: boolean;
}> = ({
  items,
  itemsProps,
  button,
  buttonProps,
  block,
  blockProps,
  chevron,
}) => {
  const isActive = items.some(x => x.isActive) || button.isActive;
  const [isMobileOpen, setIsMobileOpen] = useState(isActive);
  if (block) {
    return (
      <div className={clsx(blockProps?.className)}>
        <MenuItem
          onClick={() => setIsMobileOpen(p => !p)}
          value={button}
          {...buttonProps}
        >
          {chevron && (
            <Icon
              className={clsx('-mx-1', isMobileOpen && 'rotate-180')}
              name={bxChevronDown}
              size={16}
            />
          )}
        </MenuItem>
        <AnimateHeight height={isMobileOpen ? 'auto' : 0}>
          <div className="flex w-full flex-col items-start justify-start gap-0 ps-6">
            {items.map(subMenuItem => (
              <MenuItem
                block
                key={subMenuItem.link}
                value={subMenuItem}
                {...itemsProps}
              />
            ))}
          </div>
        </AnimateHeight>
      </div>
    );
  }
  return (
    <ClickableTooltip
      chevron={false}
      title={
        <div className="-m-1">
          {items.map(item => (
            <MenuItem
              className="!justify-start !px-2 w-full"
              key={item.link}
              value={item}
              {...itemsProps}
            />
          ))}
        </div>
      }
    >
      <MenuItem
        isActive={isActive}
        onClick={() => {}}
        value={button}
        {...buttonProps}
      >
        {chevron && (
          <Icon className="-mx-1 opacity-75" name={bxChevronDown} size={16} />
        )}
      </MenuItem>
    </ClickableTooltip>
  );
};
