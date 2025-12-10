import { bxPin, bxX } from 'boxicons-quasar';
import { clsx } from 'clsx';
import BtnInstantTrade from 'modules/autoTrader/BuySellTrader/BtnInstantTrade';
import TokenSwaps from 'modules/autoTrader/TokenSwaps';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import DevTokens from 'modules/discovery/DetailView/CoinDetail/CoinDetailsExpanded/DevTokens';
import Faster100xWidget from 'modules/discovery/DetailView/CoinDetail/CoinDetailsExpanded/Faster100xWidget';
import Orders from 'modules/discovery/DetailView/CoinDetail/CoinDetailsExpanded/Orders';
import { Fragment, useEffect } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import {
  ResizableSides,
  type ResizableSidesValue,
} from 'shared/v1-components/ResizableSides';
import { useLocalStorage } from 'usehooks-ts';
import { CoinMessagesWidget } from '../CoinMessagesWidget';
import { CoinPoolsWidget } from '../CoinPoolsWidget';
import {
  CoinTopHoldersWidget,
  CoinTopTradersWidget,
} from '../CoinTopTraderHoldersWidget';
import { useUnifiedCoinDetails } from '../lib';
import { useCoinDetailsTabs } from '../useCoinDetailsTabs';
import { ReactComponent as BubbleIcon } from './bubble.svg';

export const CoinDetailsTabs = () => {
  const { symbol } = useUnifiedCoinDetails();
  const [activeQuote, setActiveQuote] = useActiveQuote();

  const tabs = useCoinDetailsTabs();
  const [pinnedTab, setPinnedTab] = useLocalStorage<string>(
    'coin-details-pinned-tab',
    'coinoverview_swaps',
  );
  const [selectedTab, setSelectedTab] = useLocalStorage<string>(
    'coin-details-selected-tab',
    '',
  );
  const [leftSideSize, setLeftSideSize] = useLocalStorage<
    ResizableSidesValue | undefined
  >('coin-details-leftside-sizes', '60%');

  const tabContents = {
    coinoverview_swaps: <TokenSwaps />,
    coinoverview_orders: <Orders />,
    coinoverview_trading_view: (
      <CoinMessagesWidget
        className="w-full"
        limit={false}
        title={false}
        type="technical_ideas"
      />
    ),
    coinoverview_socials: (
      <CoinMessagesWidget
        className="w-full"
        limit={false}
        title={false}
        type="rest"
      />
    ),
    coinoverview_dev: <DevTokens title={false} />,
    coinoverview_pools: (
      <CoinPoolsWidget
        className="w-full"
        limit={Number.POSITIVE_INFINITY}
        title={false}
      />
    ),
    coinoverview_top_traders: (
      <CoinTopTradersWidget className="w-full" title={false} />
    ),
    coinoverview_top_holders: (
      <CoinTopHoldersWidget className="w-full" title={false} />
    ),
    coinoverview_bubble_chart: <Faster100xWidget className="h-full w-full" />,
  };

  useEffect(() => {
    if (selectedTab && selectedTab !== pinnedTab) return;
    setSelectedTab(
      tabs?.find(x => !x.disabled && !x.hidden && pinnedTab !== x.value)
        ?.value!,
    );
  }, [tabs, selectedTab, pinnedTab, setSelectedTab]);

  return (
    <div className="flex h-[calc(var(--desktop-content-height)-64px)] max-h-[calc(var(--desktop-content-height)-64px)] max-w-full flex-col overflow-hidden">
      <div className="absolute top-1.5 right-0 z-30 flex shrink-0 items-center justify-start gap-px pe-2">
        <HoverTooltip className="flex" title="Bubble Chart - Faster 100x">
          <Button
            className="mr-1"
            fab
            onClick={() =>
              setPinnedTab(
                pinnedTab === 'coinoverview_bubble_chart'
                  ? ''
                  : 'coinoverview_bubble_chart',
              )
            }
            size="2xs"
            surface={0}
            variant="outline"
          >
            <BubbleIcon />
          </Button>
        </HoverTooltip>
        <BtnInstantTrade
          quote={activeQuote}
          setQuote={setActiveQuote}
          slug={symbol.slug}
        />
      </div>
      <ResizableSides
        className={[
          clsx(
            'w-full',
            pinnedTab
              ? '!max-w-[calc(100%-20rem)] !min-w-[20rem]'
              : 'min-w-full',
          ),
          clsx(
            '',
            !pinnedTab
              ? 'w-0 max-w-0'
              : '!max-w-[calc(100%-20rem)] !min-w-[20rem] w-full',
          ),
        ]}
        direction="col"
        onChange={setLeftSideSize}
        rootClassName="relative h-full w-full min-w-0 shrink grow"
        value={leftSideSize}
      >
        {[
          <Fragment key="leftside">
            <div className="flex h-full flex-col">
              <div
                className={clsx(
                  'sticky top-0 z-10 w-full',
                  !pinnedTab && 'pe-48',
                )}
              >
                <ButtonSelect
                  buttonClassName="grow"
                  className="!max-w-full !w-full rounded-none [&>div]:w-full"
                  innerScroll
                  onChange={newTab => {
                    setSelectedTab(newTab);
                  }}
                  options={tabs
                    .filter(
                      x =>
                        x.value !== pinnedTab &&
                        x.value !== 'coinoverview_bubble_chart',
                    )
                    .map(x => {
                      return {
                        ...x,
                        label: (
                          <>
                            {x.label}
                            {x.value === selectedTab && (
                              <HoverTooltip
                                className="mt-1"
                                title="Pin to the Right"
                              >
                                <Button
                                  className="rounded-full"
                                  fab
                                  onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPinnedTab(x.value);
                                  }}
                                  size="3xs"
                                  surface={0}
                                  variant="ghost"
                                >
                                  <Icon className="scale-75" name={bxPin} />
                                </Button>
                              </HoverTooltip>
                            )}
                          </>
                        ),
                      };
                    })}
                  size="sm"
                  surface={0}
                  value={selectedTab}
                  variant="tab"
                />
              </div>
              <div className="scrollbar-none -mt-[1px] grow overflow-auto border-white/10 border-t p-2">
                {Object.entries(tabContents).map(([key, value]) => (
                  <div
                    className={key !== selectedTab ? 'hidden' : ''}
                    key={key}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </Fragment>,
          <Fragment key="right">
            <div className="flex h-full flex-col">
              <div className="w-full">
                <ButtonSelect
                  buttonClassName="grow !justify-start"
                  className="!max-w-full !w-full rounded-none [&>div]:w-full"
                  innerScroll
                  options={tabs
                    .filter(x => x.value === pinnedTab)
                    .map(x => {
                      return {
                        ...x,
                        label: (
                          <>
                            {x.label}
                            <HoverTooltip className="mt-1" title="Unpin">
                              <Button
                                className="rounded-full"
                                fab
                                onClick={() => {
                                  setPinnedTab('');
                                }}
                                size="3xs"
                                variant="outline"
                              >
                                <Icon className="scale-75" name={bxX} />
                              </Button>
                            </HoverTooltip>
                          </>
                        ),
                      };
                    })}
                  size="sm"
                  surface={0}
                  variant="tab"
                />
              </div>
              <div className="grow overflow-auto p-2">
                {Object.entries(tabContents).map(([key, value]) => (
                  <div className={key !== pinnedTab ? 'hidden' : ''} key={key}>
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </Fragment>,
        ]}
      </ResizableSides>
    </div>
  );
};
