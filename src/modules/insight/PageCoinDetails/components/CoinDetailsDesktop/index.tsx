/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { type FC, useRef } from 'react';
import UserAssets from 'modules/autoTrader/UserAssets';
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
import { NCoinRisksBanner } from '../NCoinRisksBanner';
import TraderSection from './TraderSection';

const sideClasses = clsx(
  'sticky top-[76px] max-h-[calc(100vh-76px)] overflow-y-auto scrollbar-none',
);

export const CoinDetailsDesktop: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);

  return (
    <div className="flex flex-nowrap justify-between">
      {/* Discover */}
      <div
        className={clsx(
          'flex w-1/4 min-w-60 max-w-80 flex-col gap-3 px-3 ps-0',
          sideClasses,
        )}
      >
        <div className="contents [&:not(:has(.id-assets))]:hidden">
          <h3 className="my-2 text-xxs">Your Portfolio</h3>
          <div className="shrink-0 space-y-4 overflow-hidden rounded-md">
            <UserAssets
              noTotal
              className="id-assets"
              containerClassName="!p-0"
            />
          </div>
          <hr className="border-white/10" />
        </div>

        <CoinDiscoverWidget />
      </div>

      {/* Validate */}
      <div className="relative w-full min-w-[300px] max-w-full grow border-x border-white/10">
        <NCoinRisksBanner slug={slug} />
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
      <div className="relative w-1/3 min-w-[22rem] max-w-96 p-3 pe-0 pt-0">
        <div className={sideClasses}>
          <div className="space-y-3 py-2">
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
