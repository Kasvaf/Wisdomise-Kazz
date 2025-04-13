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
import { CoinWhaleListWidget } from '../CoinWhaleListWidget';
import { useCoinDetailsTabs } from '../../hooks/useCoinDetailsTabs';
import { CoinFinderWidget } from '../CoinFinderWidget';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { PoolSentimentWidget } from '../PoolSentimentWidget';
import { PoolStatsWidget } from '../PoolStatsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import CoinChart from '../CoinChart';

export const CoinDetailsDesktop: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <>
      <div className="flex flex-nowrap items-stretch justify-between overflow-hidden">
        {/* Discover */}
        <div className="w-60 shrink-0 overflow-hidden p-3 ps-0 tablet:w-60">
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
        <div className="shrink grow overflow-auto border-x border-white/10">
          {/* Sentiment Widgets */}
          <CoinSentimentsWidget slug={slug} className="p-3" hr />
          <PoolSentimentWidget slug={slug} className="p-3" hr />
          <CoinTitleWidget slug={slug} className="p-3" hr />
          <CoinChart slug={slug} height={420} />
        </div>

        {/* Trade + Additional */}
        <div className="w-80 shrink-0 space-y-3 p-3 pe-0 tablet:w-60">
          {isDebugMode && (
            <>
              <div className="rounded-md p-3 py-16 text-center text-v1-content-secondary">
                {'TODO: Trade Section'}
              </div>
              <hr className="border-white/10" />
            </>
          )}
          <CoinStatsWidget slug={slug} />
          <PoolStatsWidget slug={slug} />
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
            {/* <CoinLinksWidget slug={slug} /> */}
            <CoinPricePerformanceWidget slug={slug} />
          </div>
        </div>

        <div className="col-span-2 flex flex-col lg:gap-3 2xl:gap-6">
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
