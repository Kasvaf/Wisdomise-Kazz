/* eslint-disable import/max-dependencies */
import { type FC, useRef } from 'react';
import { isDebugMode } from 'utils/version';
import { CoinStatsWidget } from '../CoinStatsWidget';
import { CoinDetailsTabs } from '../CoinDetailsTabs';
import { useCoinDetailsTabs } from '../../hooks/useCoinDetailsTabs';
import { CoinFinderWidget } from '../CoinFinderWidget';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { PoolSentimentWidget } from '../PoolSentimentWidget';
import { PoolStatsWidget } from '../PoolStatsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import CoinChart from '../CoinChart';
import { CoinMessagesWidget } from '../CoinMessagesWidget';

export const CoinDetailsDesktop: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <div className="flex flex-nowrap items-stretch justify-between">
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
      <div className="relative shrink grow border-x border-white/10">
        {/* Sentiment Widgets */}
        <CoinSentimentsWidget slug={slug} className="p-3" hr />
        <PoolSentimentWidget slug={slug} className="p-3" hr />
        <CoinTitleWidget
          slug={slug}
          className="sticky top-[76px] z-50 p-3 bg-v1-surface-l-current"
          hr
        />
        <CoinChart slug={slug} height={420} />

        <div className="relative space-y-4">
          <CoinDetailsTabs
            options={tabs}
            className="sticky top-[140px] z-50 p-3 bg-v1-surface-l-current"
            hr
          />
          <div className="relative space-y-4 p-3">
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
          </div>
          {/* <CoinWhaleListWidget id="coinoverview_whales" slug={slug} /> */}
          {/* <CoinAvailableExchangesWidget
            slug={slug}
            id="coinoverview_exchanges"
          />
          <CoinIntroductionWidget slug={slug} /> */}
        </div>
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
  );
};
