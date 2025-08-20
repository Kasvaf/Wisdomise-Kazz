import { type FC, Fragment, useEffect, useRef, useState } from 'react';
import { bxChevronDown, bxChevronUp } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useSessionStorage } from 'usehooks-ts';
import {
  ResizableSides,
  type ResizableSidesValue,
} from 'shared/v1-components/ResizableSides';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { CoinStatsWidget } from '../CoinStatsWidget';
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
import { NCoinInsightWidget } from '../NCoinInsightWidget';
import { CoinPriceWidget } from '../CoinPriceWidget';
import { CoinTopTraderHoldersWidget } from '../CoinTopTraderHoldersWidget';
import TraderSection from './TraderSection';

export const CoinDetailsExpanded: FC<{ slug: string }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useCoinDetailsTabs(root);
  const [selectedTab, setSelectedTab] = useState<string>();
  useEffect(() => {
    setSelectedTab(tabs.find(x => !x.disabled && !x.hidden)?.value);
  }, [tabs]);

  const [quote, setQuote] = useActiveQuote();
  const [upSideSize, setUpSideSize] = useSessionStorage<
    ResizableSidesValue | undefined
  >('coin-details-upside-sizes', '60%');

  return (
    <div className="flex h-(--desktop-content-height) w-full min-w-0 max-w-full flex-nowrap justify-between overflow-hidden">
      {/* Validate */}
      <ResizableSides
        direction="row"
        rootClassName="relative h-(--desktop-content-height) max-h-(--desktop-content-height) w-full min-w-0 shrink grow border-r border-white/10"
        className={[
          clsx(
            'overflow-hidden',
            upSideSize === '0%'
              ? '!h-[60px]'
              : upSideSize === '100%'
                ? '!h-[calc(100%-3rem)]'
                : '!max-h-[calc(100%-8rem)] !min-h-[8rem]',
          ),
          clsx(upSideSize === '100%' && 'overflow-hidden'),
        ]}
        value={upSideSize}
        onChange={setUpSideSize}
      >
        {[
          <div key="up-side" className="flex h-full flex-col">
            <NCoinSentimentWidget slug={slug} className="shrink-0 p-3" hr />
            <CoinTitleWidget
              slug={slug}
              className="h-16 shrink-0 px-3 bg-v1-surface-l-current"
              suffix={<CoinSentimentsWidget slug={slug} />}
              hr
            />
            <div className="grow">
              <CoinChart slug={slug} />
            </div>
          </div>,
          <Fragment key="down-side">
            <div className="sticky top-0 z-20 mb-3 flex shrink-0 items-center justify-start gap-px border-b border-white/10 bg-v1-surface-l0 pe-3">
              <ButtonSelect
                options={tabs}
                value={selectedTab}
                onChange={newTab => {
                  setSelectedTab(newTab);
                  setUpSideSize(p => (p === '100%' ? '60%' : p));
                }}
                surface={0}
                className="me-3 max-w-full grow rounded-none"
                buttonClassName="px-4"
                variant="tab"
                size="sm"
              />
              {upSideSize !== '100%' && (
                <Button
                  fab
                  variant="outline"
                  size="3xs"
                  className="shrink-0 rounded-full"
                  surface={1}
                  onClick={() =>
                    setUpSideSize(p => (p === '0%' ? '60%' : '100%'))
                  }
                >
                  <Icon name={bxChevronDown} />
                </Button>
              )}
              {upSideSize !== '0%' && (
                <Button
                  fab
                  variant="outline"
                  size="3xs"
                  className="shrink-0 rounded-full"
                  surface={1}
                  onClick={() =>
                    setUpSideSize(p => (p === '100%' ? '60%' : '0%'))
                  }
                >
                  <Icon name={bxChevronUp} />
                </Button>
              )}
            </div>
            <div ref={root} className="p-3 pt-0">
              <CoinIntroductionWidget
                id="coinoverview_introduction"
                title={false}
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_introduction' && 'hidden',
                )}
              />
              <CoinMessagesWidget
                id="coinoverview_trading_view"
                title={false}
                limit={false}
                type="technical_ideas"
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_trading_view' && 'hidden',
                )}
              />
              <CoinMessagesWidget
                id="coinoverview_socials"
                title={false}
                limit={false}
                type="rest"
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_socials' && 'hidden',
                )}
              />
              <CoinPoolsWidget
                id="coinoverview_pools"
                title={false}
                limit={Number.POSITIVE_INFINITY}
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_pools' && 'hidden',
                )}
              />
              <CoinExchangesWidget
                id="coinoverview_exchanges"
                title={false}
                limit={Number.POSITIVE_INFINITY}
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_exchanges' && 'hidden',
                )}
              />
              <CoinWhalesWidget
                id="coinoverview_active_whales"
                type="active"
                title={false}
                limit={Number.POSITIVE_INFINITY}
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_active_whales' && 'hidden',
                )}
              />
              <CoinWhalesWidget
                id="coinoverview_holding_whales"
                type="holding"
                title={false}
                limit={Number.POSITIVE_INFINITY}
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_holding_whales' && 'hidden',
                )}
              />
              <CoinTopTraderHoldersWidget
                id="coinoverview_top_traders"
                type="traders"
                title={false}
                limit={Number.POSITIVE_INFINITY}
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_top_traders' && 'hidden',
                )}
              />
              <CoinTopTraderHoldersWidget
                id="coinoverview_top_holders"
                type="holders"
                title={false}
                limit={Number.POSITIVE_INFINITY}
                slug={slug}
                className={clsx(
                  selectedTab !== 'coinoverview_top_holders' && 'hidden',
                )}
              />
            </div>
          </Fragment>,
        ]}
      </ResizableSides>

      {/* Trade + Additional */}
      <div className="sticky top-(--desktop-content-top) z-50 h-(--desktop-content-height) w-96 min-w-[360px] shrink overflow-y-auto bg-v1-surface-l0 scrollbar-none">
        <NCoinRisksBanner slug={slug} />
        <CoinPriceWidget slug={slug} className="h-16 px-3" hr />
        <div className="space-y-3 px-3 pb-3 pt-1">
          <TraderSection slug={slug} quote={quote} setQuote={setQuote} />
          <hr className="border-white/10" />
          <NCoinInsightWidget slug={slug} />
          <CoinStatsWidget slug={slug} />
          <NCoinStatsWidget slug={slug} />
        </div>
      </div>
    </div>
  );
};
