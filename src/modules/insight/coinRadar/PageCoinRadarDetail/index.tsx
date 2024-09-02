import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { OverviewWidget } from 'shared/OverviewWidget';
import {
  useCoinOverview,
  useCoinSignals,
  useHasFlag,
  useSocialMessages,
} from 'api';
import Tabs from 'shared/Tabs';
import { CoinPrice } from './components/CoinPrice';
import { CoinSocialFeed } from './components/CoinSocialFeed';
import { CoinStats } from './components/CoinStats';
import { CoinCandleChart } from './components/CoinCandleChart';
import { CoinAvailableExchanges } from './components/CoinAvailableExchanges';
import { CoinSocialSentiment } from './components/CoinSocialSentiment';
import { CoinPricePerformance } from './components/CoinPricePerformance';
import { TopCoins } from './components/TopCoins';
import { WhalePopularCoins } from './components/WhalePopularCoins';
import { useScrollPointTabs } from './hooks/useScrollPointTabs';
import { ReactComponent as TradingViewIcon } from './components/CoinSocialFeed/images/trading_view.svg';

export default function PageCoinRadarDetail() {
  const { t } = useTranslation('coin-radar');
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  const hasFlag = useHasFlag();
  const messages = useSocialMessages(slug);
  const coinOverview = useCoinOverview({ slug });
  const signals = useCoinSignals();
  const coinSignal = signals.data?.find(signal => signal.symbol.slug === slug);

  const scrollPointTabs = useScrollPointTabs(
    [
      {
        key: 'coinoverview_chart',
        label: t('coin-details.tabs.chart.label'),
      },
      {
        key: 'coinoverview_socials',
        label: t('coin-details.tabs.socials.label'),
      },
      {
        key: 'coinoverview_exchanges',
        label: t('coin-details.tabs.markets.label'),
      },
      {
        key: 'coinoverview_trading_view',
        label: (
          <div className="inline-flex items-center gap-1">
            <TradingViewIcon className="size-4" />
            {t('coin-details.tabs.trading_view.label')}
          </div>
        ),
      },
    ],
    160,
  );
  return (
    <PageWrapper
      loading={
        coinOverview.isLoading || signals.isLoading || messages.isLoading
      }
    >
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col gap-6 mobile:col-span-full">
          <OverviewWidget>
            <CoinPrice slug={slug} />
          </OverviewWidget>
          <OverviewWidget>
            <CoinStats slug={slug} />
          </OverviewWidget>
          {coinSignal && hasFlag('/insight/coin-radar?side-suggestion') && (
            <OverviewWidget>
              <CoinSocialSentiment slug={slug} />
            </OverviewWidget>
          )}
          <OverviewWidget>
            <CoinPricePerformance slug={slug} />
          </OverviewWidget>
          <OverviewWidget title={t('coin-details.tabs.trending_coins.title')}>
            <TopCoins slug={slug} />
          </OverviewWidget>
          <OverviewWidget title={t('coin-details.tabs.whale_popular.title')}>
            <WhalePopularCoins slug={slug} />
          </OverviewWidget>
        </div>
        <div className="col-span-2 flex flex-col gap-6 mobile:col-span-full">
          <Tabs
            className="sticky top-0 z-50 backdrop-blur-md mobile:hidden"
            {...scrollPointTabs}
          />
          <OverviewWidget
            id="coinoverview_chart"
            title={t('coin-details.tabs.chart.title')}
            contentClassName="min-h-[600px] overflow-hidden"
            className="col-span-2 mobile:col-span-full"
          >
            <CoinCandleChart slug={slug} />
          </OverviewWidget>
          <OverviewWidget
            id="coinoverview_socials"
            title={t('coin-details.tabs.socials.title')}
            subtitle={t('coin-details.tabs.socials.subtitle')}
          >
            <CoinSocialFeed
              slug={slug}
              socials={['reddit', 'telegram', 'twitter']}
              pageSize={4}
            />
          </OverviewWidget>
          <OverviewWidget
            id="coinoverview_exchanges"
            title={t('coin-details.tabs.markets.title')}
            subtitle={t('coin-details.tabs.markets.subtitle')}
            className="col-span-2 mobile:col-span-full"
          >
            <CoinAvailableExchanges slug={slug} />
          </OverviewWidget>
          <OverviewWidget
            id="coinoverview_trading_view"
            title={t('coin-details.tabs.trading_view.title')}
          >
            <CoinSocialFeed
              slug={slug}
              socials={['trading_view']}
              pageSize={1}
            />
          </OverviewWidget>
        </div>
      </div>
    </PageWrapper>
  );
}
