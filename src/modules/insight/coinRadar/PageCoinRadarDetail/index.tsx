import { useParams } from 'react-router-dom';
import PageWrapper from 'modules/base/PageWrapper';
import { CoinPriceWidget } from './components/CoinPriceWidget';
import { CoinStatsWidget } from './components/CoinStatsWidget';
import { CoinSocialSentimentWidget } from './components/CoinSocialSentimentWidget';
import { CoinPricePerformanceWidget } from './components/CoinPricePerformanceWidget';
import { CoinSocialFeedWidget } from './components/CoinSocialFeedWidget';
import { CoinAvailableExchangesWidget } from './components/CoinAvailableExchangesWidget';
import { TechnicalIdeasWidget } from './components/TechnicalIdeasWidget';
import { PageCoinRadarDetailMeta } from './components/PageCoinRadarDetailMeta';
import { HotCoinsWidget } from './components/HotCoinsWidget';
import { CoinIntroductionWidget } from './components/CoinIntroductionWidget';
import { CoinRadarTabs } from './components/CoinRadarTabs';
import { CoinLinksWidget } from './components/CoinLinksWidget';

export default function PageCoinRadarDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  return (
    <PageWrapper>
      <PageCoinRadarDetailMeta slug={slug} />
      <div className="relative grid grid-cols-3 gap-6">
        <div className="col-span-1 mobile:col-span-full">
          <div className="sticky top-0 flex flex-col gap-6 mobile:relative">
            <CoinPriceWidget slug={slug} />
            <CoinStatsWidget slug={slug} />
            <CoinLinksWidget slug={slug} />
            <CoinSocialSentimentWidget slug={slug} />
            <CoinPricePerformanceWidget slug={slug} />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-6 mobile:col-span-full">
          <CoinRadarTabs className="sticky top-0 z-50 bg-page mobile:hidden" />

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
          <CoinIntroductionWidget slug={slug} />
        </div>
      </div>
    </PageWrapper>
  );
}
