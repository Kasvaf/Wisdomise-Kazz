import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import CoinSwapActivity from 'modules/autoTrader/CoinSwapActivity';
import { type FC, useRef } from 'react';
import CoinChart from './CoinChart';
import { CoinDetailsTabs } from './CoinDetailsTabs';
import { CoinIntroductionWidget } from './CoinIntroductionWidget';
import { CoinMessagesWidget } from './CoinMessagesWidget';
import { CoinPoolsWidget } from './CoinPoolsWidget';
import { CoinPriceWidget } from './CoinPriceWidget';
import { CoinSentimentsWidget } from './CoinSentimentsWidget';
import { CoinStatsWidget } from './CoinStatsWidget';
import { CoinTitleWidget } from './CoinTitleWidget';
import { CoinTopTraderHoldersWidget } from './CoinTopTraderHoldersWidget';
import { NCoinInsightWidget } from './NCoinInsightWidget';
import { NCoinRisksBanner } from './NCoinRisksBanner';
import { NCoinStatsWidget } from './NCoinStatsWidget';
import { useCoinDetailsTabs } from './useCoinDetailsTabs';

export const CoinDetailsCompact: FC = () => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <div className="flex flex-col gap-3 p-3">
      <NCoinRisksBanner />
      <CoinTitleWidget className="bg-v1-surface-l-current" hr />
      <CoinPriceWidget />
      <BtnAutoTrade block variant="primary" />
      <CoinSentimentsWidget />
      {/* <NCoinSentimentWidget /> */}
      <CoinStatsWidget />
      <NCoinStatsWidget />
      <CoinSwapActivity />
      <NCoinInsightWidget />
      in
      <div className="h-[400px]">
        <CoinChart />
      </div>
      <CoinDetailsTabs
        className="sticky top-[90px] z-50 bg-v1-surface-l-current py-3"
        options={tabs}
      />
      <div className="relative space-y-8" ref={root}>
        <CoinIntroductionWidget id="coinoverview_introduction" />
        <CoinMessagesWidget
          id="coinoverview_trading_view"
          type="technical_ideas"
        />
        <CoinMessagesWidget id="coinoverview_socials" type="rest" />
        <CoinTopTraderHoldersWidget
          id="coinoverview_top_traders"
          type="traders"
        />
        <CoinTopTraderHoldersWidget
          id="coinoverview_top_holders"
          type="holders"
        />
        <CoinPoolsWidget id="coinoverview_pools" />
        {/* <CoinExchangesWidget id="coinoverview_exchanges" />
        <CoinWhalesWidget id="coinoverview_active_whales" type="active" />
        <CoinWhalesWidget id="coinoverview_holding_whales" type="holding" /> */}
      </div>
    </div>
  );
};
