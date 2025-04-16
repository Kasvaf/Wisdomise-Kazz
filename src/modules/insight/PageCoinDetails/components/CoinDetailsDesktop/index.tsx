/* eslint-disable import/max-dependencies */
import { type FC, useRef } from 'react';
import UserAssets from 'modules/autoTrader/UserAssets';
import Trader from 'modules/autoTrader/PageTrade/Trader';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import { CoinStatsWidget } from '../CoinStatsWidget';
import { CoinDetailsTabs } from '../CoinDetailsTabs';
import { useCoinDetailsTabs } from '../../hooks/useCoinDetailsTabs';
import { CoinDiscoverWidget } from '../CoinDiscoverWidget';
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

export const CoinDetailsDesktop: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);
  const [quote, setQuote] = useSearchParamAsState<AutoTraderSupportedQuotes>(
    'quote',
    'tether',
  );

  return (
    <div className="flex flex-nowrap justify-between">
      {/* Discover */}
      <div className="relative w-1/4 min-w-60 max-w-80 p-3 ps-0">
        <div className="space-y-3">
          <div className="[&:not(:has(.id-assets))]:hidden">
            <h3 className="mb-2 text-xxs">Your Portfolio</h3>
            <div className="space-y-4 rounded-md bg-v1-surface-l2 p-3">
              <UserAssets
                noTotal
                className="id-assets"
                containerClassName="!p-0"
              />
            </div>
            <hr className="mt-3 border-white/10" />
          </div>

          <CoinDiscoverWidget />
        </div>
      </div>

      {/* Validate */}
      <div className="relative w-full min-w-[600px] max-w-full grow border-x border-white/10">
        {/* Sentiment Widgets */}
        <CoinSentimentsWidget slug={slug} className="p-3" hr />
        <NCoinSentimentWidget slug={slug} className="p-3" hr />
        <CoinTitleWidget
          slug={slug}
          className="sticky top-[76px] z-50 p-3 bg-v1-surface-l-current"
          hr
        />
        <CoinChart slug={slug} height={420} />
        <CoinDetailsTabs
          options={tabs}
          className="sticky top-[140px] z-50 p-3 bg-v1-surface-l-current"
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
            <CoinIntroductionWidget slug={slug} />
          </div>
        </div>
      </div>

      {/* Trade + Additional */}
      <div className="relative w-1/3 min-w-72 max-w-96 p-3 pe-0">
        <div className="sticky top-[100px] space-y-3">
          <h3 className="mb-2 text-xxs">Auto Trade</h3>
          <div className="space-y-4 rounded-md bg-v1-surface-l2 p-3 [&_.id-line]:hidden">
            <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
              <Trader quote={quote} setQuote={setQuote} slug={slug} />
            </ActiveNetworkProvider>
          </div>
          <hr className="border-white/10" />
          <CoinStatsWidget slug={slug} />
          <NCoinStatsWidget slug={slug} />
        </div>
      </div>
    </div>
  );
};
