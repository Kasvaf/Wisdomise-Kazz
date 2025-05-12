/* eslint-disable import/max-dependencies */
import { type FC, useRef } from 'react';
import { CoinStatsWidget } from '../CoinStatsWidget';
import { CoinDetailsTabs } from '../CoinDetailsTabs';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { NCoinSentimentWidget } from '../NCoinSentimentWidget';
import { NCoinStatsWidget } from '../NCoinStatsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import CoinChart from '../CoinChart';
import { CoinMessagesWidget } from '../CoinMessagesWidget';
import { CoinExchangesWidget } from '../CoinExchangesWidget';
import { CoinPoolsWidget } from '../CoinPoolsWidget';
import { CoinWhalesWidget } from '../CoinWhalesWidget';
import { CoinIntroductionWidget } from '../CoinIntroductionWidget';
import { NCoinRisksBanner } from '../NCoinRisksBanner';
import { useCoinDetailsTabs } from '../useCoinDetailsTabs';
import TraderSection from './TraderSection';

export const CoinDetailsExpanded: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <div className="flex flex-nowrap justify-between">
      {/* Validate */}
      <div className="relative w-full min-w-[300px] max-w-full grow border-r border-white/10 pe-3">
        <NCoinRisksBanner slug={slug} />
        {/* Sentiment Widgets */}
        <CoinSentimentsWidget slug={slug} className="pb-3" hr />
        <NCoinSentimentWidget slug={slug} className="pb-3" hr />
        <CoinTitleWidget
          slug={slug}
          className="sticky top-[74px] z-20 py-3 bg-v1-surface-l-current"
          hr
        />
        <CoinChart slug={slug} height={420} />
        <CoinDetailsTabs
          options={tabs}
          className="sticky top-[144px] z-20 py-3 bg-v1-surface-l-current"
          hr
        />
        <div className="relative space-y-4" ref={root}>
          <div className="relative space-y-4">
            <CoinMessagesWidget
              id="coinoverview_trading_view"
              type="technical_ideas"
              slug={slug}
              hr
            />
            <CoinMessagesWidget
              id="coinoverview_socials"
              type="rest"
              slug={slug}
              hr
            />
            <CoinPoolsWidget slug={slug} id="coinoverview_pools" hr />
            <CoinExchangesWidget slug={slug} id="coinoverview_exchanges" hr />
            <CoinWhalesWidget slug={slug} id="coinoverview_whales" hr />
            <CoinIntroductionWidget slug={slug} />
          </div>
        </div>
      </div>

      {/* Trade + Additional */}
      <div className="relative w-1/3 min-w-[22rem] max-w-96 ps-3">
        <div className="sticky top-[88px] max-h-[calc(100vh-88px)] overflow-y-auto scrollbar-none">
          <div className="space-y-3">
            <TraderSection slug={slug} />
            <hr className="border-white/10" />

            <CoinStatsWidget slug={slug} />
            <NCoinStatsWidget slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
};
