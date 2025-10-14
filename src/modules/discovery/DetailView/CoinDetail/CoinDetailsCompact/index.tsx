import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import Faster100xWidget from 'modules/discovery/DetailView/CoinDetail/CoinDetailsExpanded/Faster100xWidget';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import type { FC } from 'react';
import CoinChart from '../CoinChart';
import { CoinMessagesWidget } from '../CoinMessagesWidget';
import { CoinPoolsWidget } from '../CoinPoolsWidget';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import { NCoinInsightWidget } from '../NCoinInsightWidget';
import { NCoinRisksBanner } from '../NCoinRisksBanner';
import { TokenUpdateWidget } from '../TokenUpdateWidget';
import { useCoinDetailsTabs } from '../useCoinDetailsTabs';
import { CoinDetailsTabs } from './CoinDetailsTabs';

export const CoinDetailsCompact: FC = () => {
  const tabs = useCoinDetailsTabs();
  const { symbol } = useUnifiedCoinDetails();

  return (
    <div className="flex flex-col gap-3 p-3">
      <NCoinRisksBanner />
      <CoinTitleWidget className="bg-v1-surface-l-current" hr />
      <BtnAutoTrade block slug={symbol.slug} variant="primary" />
      <CoinSentimentsWidget />
      <TokenUpdateWidget />
      <NCoinInsightWidget />
      <div className="h-[400px]">
        <CoinChart />
      </div>
      <CoinDetailsTabs
        className="sticky top-[90px] z-50 bg-v1-surface-l-current py-3"
        options={tabs}
      />
      <div className="relative space-y-8">
        <CoinMessagesWidget
          id="coinoverview_trading_view"
          type="technical_ideas"
        />
        <CoinMessagesWidget id="coinoverview_socials" type="rest" />
        <CoinPoolsWidget id="coinoverview_pools" />
        <Faster100xWidget
          className="h-96 w-full"
          id="coinoverview_bubble_chart"
        />
        {/* <CoinExchangesWidget id="coinoverview_exchanges" />
        <CoinWhalesWidget id="coinoverview_active_whales" type="active" />
        <CoinWhalesWidget id="coinoverview_holding_whales" type="holding" /> */}
      </div>
    </div>
  );
};
