/* eslint-disable import/max-dependencies */
import { type FC, useRef } from 'react';
import { CoinPriceWidget } from '../CoinPriceWidget';
import { CoinStatsWidget } from '../CoinStatsWidget';
import { CoinPricePerformanceWidget } from '../CoinPricePerformanceWidget';
import { CoinAvailableExchangesWidget } from '../CoinAvailableExchangesWidget';
import { CoinIntroductionWidget } from '../CoinIntroductionWidget';
import { CoinDetailsTabs } from '../CoinDetailsTabs';
import { CoinWhaleListWidget } from '../CoinWhaleListWidget';
import { useCoinDetailsTabs } from '../../hooks/useCoinDetailsTabs';

export const CoinDetailsMobile: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <>
      <div className="relative grid grid-cols-3 lg:gap-3 2xl:gap-6" ref={root}>
        <div className="col-span-1">
          <div className="sticky top-20 flex flex-col lg:gap-3 2xl:gap-6">
            <CoinPriceWidget slug={slug} />
            <CoinStatsWidget slug={slug} />
            {/* <CoinLinksWidget slug={slug} /> */}
            <CoinPricePerformanceWidget slug={slug} />
          </div>
        </div>

        <div className="col-span-2 flex flex-col lg:gap-3 2xl:gap-6">
          <div className="grid max-w-full grid-cols-3 items-center gap-2 2xl:gap-6">
            {/* <SocialRadarSentimentWidget slug={slug} className="w-full shrink" />
            <TechnicalRadarSentimentWidget
              slug={slug}
              className="w-full shrink"
            />
            <WhaleRadarSentimentWidget slug={slug} className="w-full shrink" /> */}
          </div>
          <CoinDetailsTabs options={tabs} className="sticky top-[72px] z-50" />
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
