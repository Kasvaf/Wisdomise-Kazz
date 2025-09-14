import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import type { FC } from 'react';
import CoinChart from '../CoinChart';
import { CoinMessagesWidget } from '../CoinMessagesWidget';
import { CoinPoolsWidget } from '../CoinPoolsWidget';
import { CoinPriceWidget } from '../CoinPriceWidget';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import { CoinUpdateWidget } from '../CoinUpdateWidget';
import { NCoinInsightWidget } from '../NCoinInsightWidget';
import { NCoinRisksBanner } from '../NCoinRisksBanner';
import { useCoinDetailsTabs } from '../useCoinDetailsTabs';
import { CoinDetailsTabs } from './CoinDetailsTabs';

export const CoinDetailsCompact: FC = () => {
  const tabs = useCoinDetailsTabs();

  return (
    <div className="flex flex-col gap-3 p-3">
      <NCoinRisksBanner />
      <CoinTitleWidget className="bg-v1-surface-l-current" hr />
      <CoinPriceWidget />
      <BtnAutoTrade block variant="primary" />
      <CoinSentimentsWidget />
      <CoinUpdateWidget />
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
        {/* <CoinExchangesWidget id="coinoverview_exchanges" />
        <CoinWhalesWidget id="coinoverview_active_whales" type="active" />
        <CoinWhalesWidget id="coinoverview_holding_whales" type="holding" /> */}
      </div>
    </div>
  );
};
