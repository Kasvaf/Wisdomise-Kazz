/* eslint-disable import/max-dependencies */
import { type FC, useRef } from 'react';
import { isDebugMode } from 'utils/version';
import { CoinPriceWidget } from '../CoinPriceWidget';
import { CoinStatsWidget } from '../CoinStatsWidget';
import { CoinPricePerformanceWidget } from '../CoinPricePerformanceWidget';
import { CoinSocialFeedWidget } from '../CoinSocialFeedWidget';
import { CoinAvailableExchangesWidget } from '../CoinAvailableExchangesWidget';
import { TechnicalIdeasWidget } from '../TechnicalIdeasWidget';
import { CoinIntroductionWidget } from '../CoinIntroductionWidget';
import { CoinRadarTabs } from '../CoinRadarTabs';
import { CoinLinksWidget } from '../CoinLinksWidget';
import { CoinWhaleListWidget } from '../CoinWhaleListWidget';
import { WhaleRadarSentimentWidget } from '../WhaleRadarSentimentWidget';
import { SocialRadarSentimentWidget } from '../SocialRadarSentimentWidget';
import { TechnicalRadarSentimentWidget } from '../TechnicalRadarSentimentWidget';
import { useCoinDetailsTabs } from '../../hooks/useCoinDetailsTabs';
import { CoinMainWidget } from '../CoinMainWidget';
import { CoinFinderWidget } from '../CoinFinderWidget';

export const CoinDetailsDesktop: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <>
      <div className="flex flex-nowrap items-stretch justify-between overflow-hidden">
        {/* Discover */}
        <div className="sticky bottom-0 w-60 shrink-0 overflow-hidden p-3 ps-0">
          {isDebugMode && (
            <>
              <div className="rounded-md p-3 py-16 text-center text-v1-content-secondary">
                {'TODO: Portfolio Section'}
              </div>
              <hr className="my-3 border-white/10" />
            </>
          )}
          <CoinFinderWidget />
        </div>
        {/* Validate */}
        <div className="grow border-x border-white/10">
          {/* Sentiment Widgets */}
          <div className="grid max-w-full grid-cols-3 items-center gap-3 border-b border-white/10 p-3">
            <SocialRadarSentimentWidget slug={slug} className="w-full shrink" />
            <TechnicalRadarSentimentWidget
              slug={slug}
              className="w-full shrink"
            />
            <WhaleRadarSentimentWidget slug={slug} className="w-full shrink" />
          </div>
        </div>
        {/* Trade + Additional */}
        <div className="w-80 shrink-0 p-3 pe-0">
          <CoinMainWidget slug={slug} />
          {isDebugMode && (
            <>
              <hr className="my-3 border-white/10" />
              <div className="rounded-md p-3 py-16 text-center text-v1-content-secondary">
                {'TODO: Trade Section'}
              </div>
            </>
          )}
          <hr className="my-3 border-white/10" />
          <CoinStatsWidget slug={slug} />
        </div>
      </div>

      <div
        className="relative grid grid-cols-3 bg-red-400 lg:gap-3 2xl:gap-6"
        ref={root}
      >
        <div className="col-span-1">
          <div className="sticky top-20 flex flex-col lg:gap-3 2xl:gap-6">
            <CoinPriceWidget slug={slug} />
            <CoinStatsWidget slug={slug} />
            <CoinLinksWidget slug={slug} />
            <CoinPricePerformanceWidget slug={slug} />
          </div>
        </div>

        <div className="col-span-2 flex flex-col lg:gap-3 2xl:gap-6">
          <div className="grid max-w-full grid-cols-3 items-center gap-2 2xl:gap-6">
            <SocialRadarSentimentWidget slug={slug} className="w-full shrink" />
            <TechnicalRadarSentimentWidget
              slug={slug}
              className="w-full shrink"
            />
            <WhaleRadarSentimentWidget slug={slug} className="w-full shrink" />
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
    </>
  );
};
