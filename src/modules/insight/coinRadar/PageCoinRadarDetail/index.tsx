import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import Tabs from 'shared/Tabs';
import { useScrollPointTabs } from './hooks/useScrollPointTabs';
import { CoinPriceWidget } from './components/CoinPriceWidget';
import { CoinStatsWidget } from './components/CoinStatsWidget';
import { CoinSocialSentimentWidget } from './components/CoinSocialSentimentWidget';
import { CoinPricePerformanceWidget } from './components/CoinPricePerformanceWidget';
import { TopCoinsWidget } from './components/TopCoinsWidget';
import { WhalePopularCoinsWidget } from './components/WhalePopularCoinsWidget';
import { CoinSocialFeedWidget } from './components/CoinSocialFeedWidget';
import { CoinAvailableExchangesWidget } from './components/CoinAvailableExchangesWidget';
import { MostViewedCoinsWidget } from './components/MostViewedCoinsWidget';
import { TechnicalIdeasWidget } from './components/TechnicalIdeasWidget';
import { PageCoinRadarDetailMeta } from './components/PageCoinRadarDetailMeta';
import { HotCoinsWidget } from './components/HotCoinsWidget';

export default function PageCoinRadarDetail() {
  const { t } = useTranslation('coin-radar');
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  const scrollPointTabs = useScrollPointTabs(
    [
      {
        key: 'coinoverview_trading_view',
        label: t('coin-details.tabs.trading_view.label'),
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
        key: 'coinoverview_hotcoins',
        label: t('coin-details.tabs.hot_coins.label'),
      },
    ],
    160,
  );
  return (
    <PageWrapper>
      <PageCoinRadarDetailMeta slug={slug} />
      <div className="relative grid grid-cols-3 gap-6">
        <div className="col-span-1 mobile:col-span-full">
          <div className="sticky top-0 flex flex-col gap-6 mobile:relative">
            <CoinPriceWidget slug={slug} />
            <CoinStatsWidget slug={slug} />
            <CoinSocialSentimentWidget slug={slug} />
            <CoinPricePerformanceWidget slug={slug} />
            <TopCoinsWidget slug={slug} />
            <MostViewedCoinsWidget slug={slug} />
            <WhalePopularCoinsWidget slug={slug} />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-6 mobile:col-span-full">
          <Tabs
            className="sticky top-0 z-50 bg-page mobile:hidden"
            {...scrollPointTabs}
          />

          <TechnicalIdeasWidget slug={slug} id="coinoverview_trading_view" />
          <CoinSocialFeedWidget
            id="coinoverview_socials"
            slug={slug}
            socials={['reddit', 'telegram', 'twitter']}
            pageSize={2}
          />
          <CoinAvailableExchangesWidget
            slug={slug}
            id="coinoverview_exchanges"
          />
          <HotCoinsWidget slug={slug} id="coinoverview_hotcoins" />
        </div>
      </div>
    </PageWrapper>
  );
}
