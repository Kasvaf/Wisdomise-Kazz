import { bxChevronDown, bxChevronUp, bxPin, bxX } from 'boxicons-quasar';
import { clsx } from 'clsx';
import AssetSwapsStream from 'modules/autoTrader/AssetSwapsStream';
import BtnInstantTrade from 'modules/autoTrader/BuySellTrader/BtnInstantTrade';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import Faster100xWidget from 'modules/discovery/DetailView/CoinDetail/CoinDetailsExpanded/Faster100xWidget';
import { type FC, Fragment, useEffect } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import {
  ResizableSides,
  type ResizableSidesValue,
} from 'shared/v1-components/ResizableSides';
import { useSessionStorage } from 'usehooks-ts';
import { CoinMessagesWidget } from '../CoinMessagesWidget';
import { CoinPoolsWidget } from '../CoinPoolsWidget';
import {
  CoinTopHoldersWidget,
  CoinTopTradersWidget,
} from '../CoinTopTraderHoldersWidget';
import { useUnifiedCoinDetails } from '../lib';
import { useCoinDetailsTabs } from '../useCoinDetailsTabs';

export const CoinDetailsTabs: FC<{
  expandable?: boolean;
  collapsable?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onTabChange?: () => void;
}> = ({ expandable, collapsable, onExpand, onCollapse, onTabChange }) => {
  const { symbol } = useUnifiedCoinDetails();
  const [activeQuote, setActiveQuote] = useActiveQuote();

  const tabs = useCoinDetailsTabs();
  const [pinnedTab, setPinnedTab] = useSessionStorage<string>(
    'coin-details-pinned-tab',
    '',
  );
  const [selectedTab, setSelectedTab] = useSessionStorage<string>(
    'coin-details-selected-tab',
    '',
  );
  const [leftSideSize, setLeftSideSize] = useSessionStorage<
    ResizableSidesValue | undefined
  >('coin-details-leftside-sizes', '60%');

  const tabContents = {
    coinoverview_swaps: <AssetSwapsStream />,
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
    coinoverview_faster_100x: <Faster100xWidget className="h-64 w-full" />,
  };

  useEffect(() => {
    if (selectedTab && selectedTab !== pinnedTab) return;
    setSelectedTab(
      tabs?.find(x => !x.disabled && !x.hidden && pinnedTab !== x.value)
        ?.value!,
    );
  }, [tabs, selectedTab, pinnedTab, setSelectedTab]);

  return (
    <div className="flex max-h-full min-h-full max-w-full flex-col overflow-hidden">
      <div className="absolute top-1 right-0 z-[100] flex shrink-0 items-center justify-start gap-px pe-2">
        <BtnInstantTrade
          className="me-2"
          quote={activeQuote}
          setQuote={setActiveQuote}
          slug={symbol.slug}
        />
        {collapsable && (
          <Button
            className="shrink-0 rounded-full"
            fab
            onClick={onCollapse}
            size="3xs"
            surface={1}
            variant="outline"
          >
            <Icon name={bxChevronDown} />
          </Button>
        )}
        {expandable && (
          <Button
            className="shrink-0 rounded-full"
            fab
            onClick={onExpand}
            size="3xs"
            surface={1}
            variant="outline"
          >
            <Icon name={bxChevronUp} />
          </Button>
        )}
      </div>
      <ResizableSides
        className={[
          clsx(
            'w-full overflow-auto',
            pinnedTab
              ? '!max-w-[calc(100%-20rem)] !min-w-[20rem]'
              : 'min-w-full',
          ),
          clsx(
            'overflow-auto',
            !pinnedTab
              ? 'w-0 max-w-0'
              : '!max-w-[calc(100%-20rem)] !min-w-[20rem] w-full',
          ),
        ]}
        direction="col"
        onChange={setLeftSideSize}
        rootClassName="relative w-full min-w-0 shrink grow border-r border-white/10"
        value={leftSideSize}
      >
        {[
          <Fragment key="leftside">
            <div
              className={clsx(
                'sticky top-0 z-10 w-full border-v1-border-tertiary border-b bg-v1-surface-l0',
                !pinnedTab && 'pe-52',
              )}
            >
              <ButtonSelect
                buttonClassName="grow"
                className="!max-w-full !w-full rounded-none [&>div]:w-full"
                innerScroll
                onChange={newTab => {
                  setSelectedTab(newTab);
                  onTabChange?.();
                }}
                options={tabs
                  .filter(x => x.value !== pinnedTab)
                  .map(x => {
                    return {
                      ...x,
                      label: (
                        <>
                          {x.label}
                          {x.value === selectedTab && (
                            <Button
                              className="rounded-full"
                              fab
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPinnedTab(x.value);
                              }}
                              size="3xs"
                              variant="outline"
                            >
                              <Icon className="scale-75" name={bxPin} />
                            </Button>
                          )}
                        </>
                      ),
                    };
                  })}
                size="xs"
                surface={0}
                value={selectedTab}
                variant="tab"
              />
            </div>
            <div className="overflow-auto px-2 pe-1 pt-2">
              {tabContents[selectedTab as never]}
            </div>
          </Fragment>,
          <Fragment key="right">
            <div className="sticky top-0 z-10 w-full border-v1-border-tertiary border-b">
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
                          <Button
                            className="rounded-full"
                            fab
                            onClick={() => {
                              setPinnedTab('');
                              setSelectedTab(x.value);
                            }}
                            size="3xs"
                            variant="outline"
                          >
                            <Icon className="scale-75" name={bxX} />
                          </Button>
                        </>
                      ),
                    };
                  })}
                size="xs"
                surface={0}
                variant="tab"
              />
            </div>
            <div className="px-2 ps-1 pt-2">
              {tabContents[pinnedTab as never]}
            </div>
          </Fragment>,
        ]}
      </ResizableSides>
    </div>
  );
};
