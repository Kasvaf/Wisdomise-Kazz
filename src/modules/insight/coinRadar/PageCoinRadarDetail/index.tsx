/* eslint-disable import/max-dependencies */
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import useIsMobile from 'utils/useIsMobile';
import { CoinPriceWidget } from './components/CoinPriceWidget';
import { CoinStatsWidget } from './components/CoinStatsWidget';
import { CoinPricePerformanceWidget } from './components/CoinPricePerformanceWidget';
import { CoinSocialFeedWidget } from './components/CoinSocialFeedWidget';
import { CoinAvailableExchangesWidget } from './components/CoinAvailableExchangesWidget';
import { TechnicalIdeasWidget } from './components/TechnicalIdeasWidget';
import { PageCoinRadarDetailMeta } from './components/PageCoinRadarDetailMeta';
import { HotCoinsWidget } from './components/HotCoinsWidget';
import { CoinIntroductionWidget } from './components/CoinIntroductionWidget';
import { CoinRadarTabs } from './components/CoinRadarTabs';
import { CoinLinksWidget } from './components/CoinLinksWidget';
import { CoinWhaleListWidget } from './components/CoinWhaleListWidget';
import { WhaleRadarSentimentWidget } from './components/WhaleRadarSentimentWidget';
import { SocialRadarSentimentWidget } from './components/SocialRadarSentimentWidget';
import { TechnicalRadarSentimentWidget } from './components/TechnicalRadarSentimentWidget';

export default function PageCoinRadarDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const isMobile = useIsMobile();
  const { t } = useTranslation('coin-radar');

  const tabs = [
    {
      key: 'coinoverview_trading_view',
      label: t('coin-details.tabs.trading_view.label'),
    },
    {
      key: 'coinoverview_socials',
      label: t('coin-details.tabs.socials.label'),
    },
    {
      key: 'coinoverview_whales',
      label: t('coin-details.tabs.whale_list.label'),
    },
    {
      key: 'coinoverview_exchanges',
      label: t('coin-details.tabs.markets.label'),
    },
  ];

  return (
    <PageWrapper>
      <PageCoinRadarDetailMeta slug={slug} />

      {isMobile ? (
        <div className="relative flex flex-col gap-6">
          <CoinRadarTabs
            value={tabs}
            className="fixed top-20 z-50 w-full bg-page"
          />
          <div className="h-5" />
          <CoinPriceWidget slug={slug} className="!bg-transparent !p-1" />
          <SocialRadarSentimentWidget slug={slug} />
          <WhaleRadarSentimentWidget slug={slug} />
          <TechnicalRadarSentimentWidget slug={slug} />
          <TechnicalIdeasWidget slug={slug} id="coinoverview_trading_view" />
          <CoinStatsWidget slug={slug} />
          <CoinLinksWidget slug={slug} />
          <CoinPricePerformanceWidget slug={slug} />
          <CoinSocialFeedWidget id="coinoverview_socials" slug={slug} />
          <CoinWhaleListWidget id="coinoverview_whales" slug={slug} />
          <CoinAvailableExchangesWidget
            slug={slug}
            id="coinoverview_exchanges"
          />
          <HotCoinsWidget slug={slug} />
          <CoinIntroductionWidget slug={slug} />
        </div>
      ) : (
        <div className="relative grid grid-cols-3 gap-6">
          <div>
            <div className="sticky top-0 flex flex-col gap-6">
              <CoinPriceWidget slug={slug} />
              <CoinStatsWidget slug={slug} />
              <CoinLinksWidget slug={slug} />
              <CoinPricePerformanceWidget slug={slug} />
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-stretch gap-6">
              <TechnicalRadarSentimentWidget
                slug={slug}
                className="basis-full"
              />
              <WhaleRadarSentimentWidget slug={slug} className="basis-full" />
              <SocialRadarSentimentWidget slug={slug} className="basis-full" />
            </div>
            <CoinRadarTabs value={tabs} className="sticky top-0 z-50 bg-page" />
            <TechnicalIdeasWidget slug={slug} id="coinoverview_trading_view" />
            <CoinSocialFeedWidget id="coinoverview_socials" slug={slug} />
            <CoinWhaleListWidget id="coinoverview_whales" slug={slug} />
            <CoinAvailableExchangesWidget
              slug={slug}
              id="coinoverview_exchanges"
            />
            <HotCoinsWidget slug={slug} />
            <CoinIntroductionWidget slug={slug} />
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
