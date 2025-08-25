import { bxChevronDown, bxChevronUp } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { type FC, Fragment, useEffect, useRef, useState } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import {
  ResizableSides,
  type ResizableSidesValue,
} from 'shared/v1-components/ResizableSides';
import { useSessionStorage } from 'usehooks-ts';
import CoinChart from '../CoinChart';
import { CoinExchangesWidget } from '../CoinExchangesWidget';
import { CoinIntroductionWidget } from '../CoinIntroductionWidget';
import { CoinMessagesWidget } from '../CoinMessagesWidget';
import { CoinPoolsWidget } from '../CoinPoolsWidget';
import { CoinPriceWidget } from '../CoinPriceWidget';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { CoinStatsWidget } from '../CoinStatsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import { CoinTopTraderHoldersWidget } from '../CoinTopTraderHoldersWidget';
import { CoinWhalesWidget } from '../CoinWhalesWidget';
import { NCoinInsightWidget } from '../NCoinInsightWidget';
import { NCoinRisksBanner } from '../NCoinRisksBanner';
import { NCoinStatsWidget } from '../NCoinStatsWidget';
import { useCoinDetailsTabs } from '../useCoinDetailsTabs';
import TraderSection from './TraderSection';

export const CoinDetailsExpanded: FC = () => {
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
        direction="row"
        onChange={setUpSideSize}
        rootClassName="relative h-(--desktop-content-height) max-h-(--desktop-content-height) w-full min-w-0 shrink grow border-r border-white/10"
        value={upSideSize}
      >
        {[
          <div className="flex h-full flex-col" key="up-side">
            {/* <NCoinSentimentWidget className="shrink-0 p-3" hr /> */}
            <CoinTitleWidget
              className="h-16 shrink-0 bg-v1-surface-l-current px-3"
              hr
              suffix={<CoinSentimentsWidget />}
            />
            <div className="grow">
              <CoinChart />
            </div>
          </div>,
          <Fragment key="down-side">
            <div className="sticky top-0 z-20 mb-3 flex shrink-0 items-center justify-start gap-px border-white/10 border-b bg-v1-surface-l0 pe-3">
              <ButtonSelect
                buttonClassName="px-4"
                className="me-3 max-w-full grow rounded-none"
                onChange={newTab => {
                  setSelectedTab(newTab);
                  setUpSideSize(p => (p === '100%' ? '60%' : p));
                }}
                options={tabs}
                size="sm"
                surface={0}
                value={selectedTab}
                variant="tab"
              />
              {upSideSize !== '100%' && (
                <Button
                  className="shrink-0 rounded-full"
                  fab
                  onClick={() =>
                    setUpSideSize(p => (p === '0%' ? '60%' : '100%'))
                  }
                  size="3xs"
                  surface={1}
                  variant="outline"
                >
                  <Icon name={bxChevronDown} />
                </Button>
              )}
              {upSideSize !== '0%' && (
                <Button
                  className="shrink-0 rounded-full"
                  fab
                  onClick={() =>
                    setUpSideSize(p => (p === '100%' ? '60%' : '0%'))
                  }
                  size="3xs"
                  surface={1}
                  variant="outline"
                >
                  <Icon name={bxChevronUp} />
                </Button>
              )}
            </div>
            <div className="p-3 pt-0" ref={root}>
              <CoinIntroductionWidget
                className={clsx(
                  selectedTab !== 'coinoverview_introduction' && 'hidden',
                )}
                id="coinoverview_introduction"
                title={false}
              />
              <CoinMessagesWidget
                className={clsx(
                  selectedTab !== 'coinoverview_trading_view' && 'hidden',
                )}
                id="coinoverview_trading_view"
                limit={false}
                title={false}
                type="technical_ideas"
              />
              <CoinMessagesWidget
                className={clsx(
                  selectedTab !== 'coinoverview_socials' && 'hidden',
                )}
                id="coinoverview_socials"
                limit={false}
                title={false}
                type="rest"
              />
              <CoinPoolsWidget
                className={clsx(
                  selectedTab !== 'coinoverview_pools' && 'hidden',
                )}
                id="coinoverview_pools"
                limit={Number.POSITIVE_INFINITY}
                title={false}
              />
              <CoinExchangesWidget
                className={clsx(
                  selectedTab !== 'coinoverview_exchanges' && 'hidden',
                )}
                id="coinoverview_exchanges"
                limit={Number.POSITIVE_INFINITY}
                title={false}
              />
              <CoinWhalesWidget
                className={clsx(
                  selectedTab !== 'coinoverview_active_whales' && 'hidden',
                )}
                id="coinoverview_active_whales"
                limit={Number.POSITIVE_INFINITY}
                title={false}
                type="active"
              />
              <CoinWhalesWidget
                className={clsx(
                  selectedTab !== 'coinoverview_holding_whales' && 'hidden',
                )}
                id="coinoverview_holding_whales"
                limit={Number.POSITIVE_INFINITY}
                title={false}
                type="holding"
              />
              <CoinTopTraderHoldersWidget
                className={clsx(
                  selectedTab !== 'coinoverview_top_traders' && 'hidden',
                )}
                id="coinoverview_top_traders"
                limit={Number.POSITIVE_INFINITY}
                title={false}
                type="traders"
              />
              <CoinTopTraderHoldersWidget
                className={clsx(
                  selectedTab !== 'coinoverview_top_holders' && 'hidden',
                )}
                id="coinoverview_top_holders"
                limit={Number.POSITIVE_INFINITY}
                title={false}
                type="holders"
              />
            </div>
          </Fragment>,
        ]}
      </ResizableSides>

      {/* Trade + Additional */}
      <div className="scrollbar-none sticky top-(--desktop-content-top) z-50 h-(--desktop-content-height) w-96 min-w-[360px] shrink overflow-y-auto bg-v1-surface-l0">
        <NCoinRisksBanner />
        <CoinPriceWidget className="h-16 px-3" hr />
        <div className="space-y-3 px-3 pt-1 pb-3">
          <TraderSection quote={quote} setQuote={setQuote} />
          <hr className="border-white/10" />
          <NCoinInsightWidget />
          <CoinStatsWidget />
          <NCoinStatsWidget />
        </div>
      </div>
    </div>
  );
};
