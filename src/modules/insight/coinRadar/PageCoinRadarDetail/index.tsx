/* eslint-disable i18next/no-literal-string */
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import {
  type PropsWithChildren,
  useLayoutEffect,
  type FC,
  type SVGProps,
  useMemo,
} from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  useSocialMessages,
  useHasFlag,
  type SocialMessage as SocialMessageType,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import CoinInfo from './CoinInfo';
import { SocialMessage } from './SocialMessage';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';
import { ReactComponent as TradingViewIcon } from './images/trading_view.svg';
import { ReactComponent as RedditIcon } from './images/reddit.svg';
import { ReactComponent as TwitterIcon } from './images/twitter.svg';

export default function PageCoinRadarDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const hasFlag = useHasFlag();
  const [activeTab, setActiveTab] = useSearchParamAsState<
    SocialMessageType['social_type'] | 'all'
  >('tab', 'all');
  const messages = useSocialMessages(symbol || '');
  const activeTabMessages = messages.data?.filter(
    message =>
      (activeTab === 'all' || message.social_type === activeTab) &&
      hasFlag(`/insight/coin-radar/[symbol]?tab=${message.social_type}`),
  );
  const { t } = useTranslation();

  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  const tabsItems = useMemo(() => {
    return [
      {
        label: (
          <TabTitle isActive={activeTab === 'all'}>
            {t('coin-radar:socials.all.title')}
          </TabTitle>
        ),
        key: 'all',
        children: (
          <TabSubTitle>
            {t('coin-radar:socials.all.subtitle', {
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
                  {t('coin-radar:socials.telegram.title')}
                </TabTitle>
              ),
              key: 'telegram',
              children: (
                <TabSubTitle>
                  {t('coin-radar:socials.telegram.subtitle', {
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
                  {t('coin-radar:socials.reddit.title')}
                </TabTitle>
              ),
              key: 'reddit',
              children: (
                <TabSubTitle>
                  {t('coin-radar:socials.reddit.subtitle', {
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
                  {t('coin-radar:socials.twitter.title')}
                </TabTitle>
              ),
              key: 'twitter',
              children: (
                <TabSubTitle>
                  {t('coin-radar:socials.twitter.subtitle', {
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
                  {t('coin-radar:socials.trading-view.title')}
                </TabTitle>
              ),
              key: 'trading_view',
              children: (
                <TabSubTitle>
                  {t('coin-radar:socials.trading-view.subtitle', {
                    symbol,
                  })}
                </TabSubTitle>
              ),
            },
          ]
        : []),
    ];
  }, [activeTab, hasFlag, symbol, t]);

  return (
    <PageWrapper
      loading={messages.isLoading}
      className="leading-none mobile:leading-normal"
    >
      {symbol && <CoinInfo className="mb-4" symbol={symbol} />}
      <Tabs
        onChange={newTab => setActiveTab(newTab as typeof activeTab)}
        items={tabsItems}
      />

      <section className="mt-6 columns-2 gap-6 mobile:columns-1">
        {activeTabMessages?.map(message => (
          <SocialMessage key={message.id} message={message} className="mb-6" />
        ))}
      </section>
    </PageWrapper>
  );
}

const TabSubTitle: FC<
  PropsWithChildren<{
    className?: string;
  }>
> = ({ className, children, ...props }) => (
  <div {...props} className={clsx('mt-4 text-xs text-white/60', className)}>
    {children}
  </div>
);

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
