import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import { type FC, useRef } from 'react';
import CoinChart from './CoinChart';
import { CoinDetailsTabs } from './CoinDetailsTabs';
import { CoinExchangesWidget } from './CoinExchangesWidget';
import { CoinIntroductionWidget } from './CoinIntroductionWidget';
import { CoinMessagesWidget } from './CoinMessagesWidget';
import { CoinPoolsWidget } from './CoinPoolsWidget';
import { CoinPriceWidget } from './CoinPriceWidget';
import { CoinSentimentsWidget } from './CoinSentimentsWidget';
import { CoinStatsWidget } from './CoinStatsWidget';
import { CoinTitleWidget } from './CoinTitleWidget';
import { CoinTopTraderHoldersWidget } from './CoinTopTraderHoldersWidget';
import { CoinWhalesWidget } from './CoinWhalesWidget';
import type { ComplexSlug } from './lib';
import { NCoinInsightWidget } from './NCoinInsightWidget';
import { NCoinRisksBanner } from './NCoinRisksBanner';
import { NCoinSentimentWidget } from './NCoinSentimentWidget';
import { NCoinStatsWidget } from './NCoinStatsWidget';
import { useCoinDetailsTabs } from './useCoinDetailsTabs';

export const CoinDetailsCompact: FC<{ slug: ComplexSlug }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <div className="flex flex-col gap-3 p-3">
      <NCoinRisksBanner slug={slug} />
      <CoinTitleWidget className="bg-v1-surface-l-current" hr slug={slug} />
      <CoinPriceWidget slug={slug} />
      <BtnAutoTrade block slug={slug.slug} variant="primary" />
      <CoinSentimentsWidget slug={slug} />
      <NCoinSentimentWidget slug={slug} />
      <CoinStatsWidget slug={slug} />
      <NCoinStatsWidget slug={slug} />
      <NCoinInsightWidget slug={slug} />
      <div className="h-[400px]">
        <CoinChart slug={slug} />
      </div>
      <CoinDetailsTabs
        className="sticky top-[90px] z-50 bg-v1-surface-l-current py-3"
        options={tabs}
      />
      <div className="relative space-y-8" ref={root}>
        <CoinIntroductionWidget id="coinoverview_introduction" slug={slug} />
        <CoinMessagesWidget
          id="coinoverview_trading_view"
          slug={slug}
          type="technical_ideas"
        />
        <CoinMessagesWidget id="coinoverview_socials" slug={slug} type="rest" />
        <CoinTopTraderHoldersWidget
          id="coinoverview_top_traders"
          slug={slug}
          type="traders"
        />
        <CoinTopTraderHoldersWidget
          id="coinoverview_top_holders"
          slug={slug}
          type="holders"
        />
        <CoinPoolsWidget id="coinoverview_pools" slug={slug} />
        <CoinExchangesWidget id="coinoverview_exchanges" slug={slug} />
        <CoinWhalesWidget
          id="coinoverview_active_whales"
          slug={slug}
          type="active"
        />
        <CoinWhalesWidget
          id="coinoverview_holding_whales"
          slug={slug}
          type="holding"
        />
      </div>
    </div>
  );
};
