/* eslint-disable import/max-dependencies */
import { type FC, useRef } from 'react';
import { isDebugMode } from 'utils/version';
import { CoinStatsWidget } from '../CoinStatsWidget';
import { CoinDetailsTabs } from '../CoinDetailsTabs';
import { useCoinDetailsTabs } from '../../hooks/useCoinDetailsTabs';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { NCoinSentimentWidget } from '../NCoinSentimentWidget';
import { NCoinStatsWidget } from '../NCoinStatsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import CoinChart from '../CoinChart';
import { CoinMessagesWidget } from '../CoinMessagesWidget';
import { CoinExchangesWidget } from '../CoinExchangesWidget';
import { CoinPoolsWidget } from '../CoinPoolsWidget';
import { CoinWhalesWidget } from '../CoinWhalesWidget';

export const CoinDetailsMobile: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <div className="flex flex-col">
      <CoinTitleWidget
        slug={slug}
        className="sticky top-0 z-50 p-3 bg-v1-surface-l-current"
        hr
      />
      <CoinSentimentsWidget slug={slug} className="p-3" hr />
      <NCoinSentimentWidget slug={slug} className="p-3" hr />
      {isDebugMode && (
        <>
          <div className="rounded-md p-3 py-16 text-center text-v1-content-secondary">
            {'TODO: Trade Section'}
          </div>
          <hr className="border-white/10" />
        </>
      )}
      <CoinStatsWidget slug={slug} />
      <NCoinStatsWidget slug={slug} />
      {/* Sentiment Widgets */}
      <CoinChart slug={slug} height={420} />
      <CoinDetailsTabs
        options={tabs}
        className="sticky top-0 z-50 py-3 bg-v1-surface-l-current"
        hr
      />
      <div className="relative space-y-4" ref={root}>
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
          <CoinPoolsWidget slug={slug} id="coinoverview_pools" hr />
          <CoinExchangesWidget slug={slug} id="coinoverview_exchanges" hr />
          <CoinWhalesWidget slug={slug} id="coinoverview_whales" hr />
        </div>
      </div>
    </div>
  );
};
