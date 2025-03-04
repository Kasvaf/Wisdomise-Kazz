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
import { PageCoinDetailsMeta } from './components/PageCoinDetailsMeta';
import { CoinIntroductionWidget } from './components/CoinIntroductionWidget';
import { CoinRadarTabs } from './components/CoinRadarTabs';
import { CoinLinksWidget } from './components/CoinLinksWidget';
import { CoinWhaleListWidget } from './components/CoinWhaleListWidget';
import { WhaleRadarSentimentWidget } from './components/WhaleRadarSentimentWidget';
import { SocialRadarSentimentWidget } from './components/SocialRadarSentimentWidget';
import { TechnicalRadarSentimentWidget } from './components/TechnicalRadarSentimentWidget';

export default function PageCoinDetails() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const isMobile = useIsMobile();
  const { t } = useTranslation('coin-radar');

  const tabs = [
    {
      value: 'coinoverview_trading_view',
      label: t('coin-details.tabs.trading_view.label'),
    },
    {
      value: 'coinoverview_socials',
      label: t('coin-details.tabs.socials.label'),
    },
    {
      value: 'coinoverview_whales',
      label: t('coin-details.tabs.whale_list.label'),
    },
    {
      value: 'coinoverview_exchanges',
      label: t('coin-details.tabs.markets.label'),
    },
  ];

  return (
    <PageWrapper>
      <PageCoinDetailsMeta slug={slug} />

      {isMobile ? (
        <div className="relative flex flex-col gap-4">
          <CoinPriceWidget slug={slug} />
          <SocialRadarSentimentWidget slug={slug} className="w-full" />
          <TechnicalRadarSentimentWidget slug={slug} className="w-full" />
          <WhaleRadarSentimentWidget slug={slug} className="w-full" />
          <CoinRadarTabs options={tabs} className="!sticky top-0 z-50" />
          <TechnicalIdeasWidget slug={slug} id="coinoverview_trading_view" />
          <CoinPricePerformanceWidget slug={slug} />
          <CoinSocialFeedWidget id="coinoverview_socials" slug={slug} />
          <CoinWhaleListWidget id="coinoverview_whales" slug={slug} />
          <CoinAvailableExchangesWidget
            slug={slug}
            id="coinoverview_exchanges"
          />
        </div>
      ) : (
        <div className="relative grid grid-cols-3 lg:gap-3 2xl:gap-6">
          <div>
            <div className="sticky top-20 flex flex-col lg:gap-3 2xl:gap-6">
              <CoinPriceWidget slug={slug} />
              <CoinStatsWidget slug={slug} />
              <CoinLinksWidget slug={slug} />
              <CoinPricePerformanceWidget slug={slug} />
            </div>
          </div>

          <div className="col-span-2 flex flex-col lg:gap-3 2xl:gap-6">
            <div className="flex items-center justify-stretch lg:gap-3 2xl:gap-6">
              <SocialRadarSentimentWidget slug={slug} className="w-full" />
              <TechnicalRadarSentimentWidget slug={slug} className="w-full" />
              <WhaleRadarSentimentWidget slug={slug} className="w-full" />
            </div>
            <CoinRadarTabs options={tabs} className="sticky top-[72px] z-50" />
            <TechnicalIdeasWidget slug={slug} id="coinoverview_trading_view" />
            <CoinSocialFeedWidget id="coinoverview_socials" slug={slug} />
            <CoinWhaleListWidget id="coinoverview_whales" slug={slug} />
            <CoinAvailableExchangesWidget
              slug={slug}
              id="coinoverview_exchanges"
            />
            <CoinIntroductionWidget slug={slug} />
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
