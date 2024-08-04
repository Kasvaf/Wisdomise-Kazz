import { clsx } from 'clsx';
import { type FC, type PropsWithChildren, type SVGProps, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialMessage, useHasFlag } from 'api';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';
import { ReactComponent as TradingViewIcon } from './images/trading_view.svg';
import { ReactComponent as RedditIcon } from './images/reddit.svg';
import { ReactComponent as TwitterIcon } from './images/twitter.svg';

const TabTitle: FC<
  PropsWithChildren<{
    icon?: FC<SVGProps<SVGSVGElement>>;
    isActive: boolean;
    className?: string;
  }>
> = ({ isActive, icon: Icon, children, className, ...props }) => (
  <h2
    {...props}
    className={clsx(
      'flex items-center gap-2 text-base',
      isActive ? 'text-white' : 'opacity-60 grayscale',
      className,
    )}
  >
    {Icon && <Icon className={clsx('h-5 w-5')} />}
    {children}
  </h2>
);

const TabSubTitle: FC<
  PropsWithChildren<{
    className?: string;
  }>
> = ({ className, children, ...props }) => (
  <div {...props} className={clsx('mt-4 text-xs text-white/60', className)}>
    {children}
  </div>
);

export const useSocialTab = (symbol: string) => {
  const hasFlag = useHasFlag();
  const { t } = useTranslation('coin-radar');
  const [activeTab, setActiveTab] = useSearchParamAsState<
    SocialMessage['social_type'] | 'all'
  >('tab', 'all');

  return useMemo(() => {
    const tabs = [
      {
        label: (
          <TabTitle isActive={activeTab === 'all'}>
            {t('socials.all.title')}
          </TabTitle>
        ),
        key: 'all',
        children: (
          <TabSubTitle>
            {t('socials.all.subtitle', {
              symbol,
            })}
          </TabSubTitle>
        ),
      },
      ...(hasFlag('/insight/coin-radar/[symbol]?tab=telegram')
        ? [
            {
              label: (
                <TabTitle
                  isActive={activeTab === 'telegram'}
                  icon={TelegramIcon}
                >
                  {t('socials.telegram.title')}
                </TabTitle>
              ),
              key: 'telegram',
              children: (
                <TabSubTitle>
                  {t('socials.telegram.subtitle', {
                    symbol,
                  })}
                </TabSubTitle>
              ),
            },
          ]
        : []),
      ...(hasFlag('/insight/coin-radar/[symbol]?tab=reddit')
        ? [
            {
              label: (
                <TabTitle isActive={activeTab === 'reddit'} icon={RedditIcon}>
                  {t('socials.reddit.title')}
                </TabTitle>
              ),
              key: 'reddit',
              children: (
                <TabSubTitle>
                  {t('socials.reddit.subtitle', {
                    symbol,
                  })}
                </TabSubTitle>
              ),
            },
          ]
        : []),
      ...(hasFlag('/insight/coin-radar/[symbol]?tab=twitter')
        ? [
            {
              label: (
                <TabTitle isActive={activeTab === 'twitter'} icon={TwitterIcon}>
                  {t('socials.twitter.title')}
                </TabTitle>
              ),
              key: 'twitter',
              children: (
                <TabSubTitle>
                  {t('socials.twitter.subtitle', {
                    symbol,
                  })}
                </TabSubTitle>
              ),
            },
          ]
        : []),
      ...(hasFlag('/insight/coin-radar/[symbol]?tab=trading_view')
        ? [
            {
              label: (
                <TabTitle
                  isActive={activeTab === 'trading_view'}
                  icon={TradingViewIcon}
                >
                  {t('socials.trading-view.title')}
                </TabTitle>
              ),
              key: 'trading_view',
              children: (
                <TabSubTitle>
                  {t('socials.trading-view.subtitle', {
                    symbol,
                  })}
                </TabSubTitle>
              ),
            },
          ]
        : []),
    ];

    return [activeTab, setActiveTab, tabs] as const;
  }, [activeTab, hasFlag, setActiveTab, symbol, t]);
};
