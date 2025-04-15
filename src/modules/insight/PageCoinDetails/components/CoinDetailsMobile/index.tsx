/* eslint-disable import/max-dependencies */
import { type FC, useRef } from 'react';
import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
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
    <div className="flex flex-col gap-3">
      <CoinTitleWidget slug={slug} className="bg-v1-surface-l-current" hr />
      <CoinSentimentsWidget slug={slug} />
      <NCoinSentimentWidget slug={slug} />
      <BtnAutoTrade slug={slug} block className="w-full" variant="outline" />
      <CoinStatsWidget slug={slug} />
      <NCoinStatsWidget slug={slug} />
      <CoinChart slug={slug} height={420} />
      <CoinDetailsTabs
        options={tabs}
        className="sticky top-[90px] z-50 py-3 bg-v1-surface-l-current"
      />
      <div className="relative space-y-8" ref={root}>
        <CoinMessagesWidget
          id="coinoverview_trading_view"
          type="technical_ideas"
          slug={slug}
        />
        <CoinMessagesWidget id="coinoverview_socials" type="rest" slug={slug} />
        <CoinPoolsWidget slug={slug} id="coinoverview_pools" />
        <CoinExchangesWidget slug={slug} id="coinoverview_exchanges" />
        <CoinWhalesWidget slug={slug} id="coinoverview_whales" />
      </div>
    </div>
  );
};
