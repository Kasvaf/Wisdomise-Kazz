import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { type FC, Fragment, useRef } from 'react';
import {
  ResizableSides,
  type ResizableSidesValue,
} from 'shared/v1-components/ResizableSides';
import { useSessionStorage } from 'usehooks-ts';
import CoinChart from '../CoinChart';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import { NCoinInsightWidget } from '../NCoinInsightWidget';
import { NCoinRisksBanner } from '../NCoinRisksBanner';
import { TokenUpdateWidget } from '../TokenUpdateWidget';
import { CoinDetailsTabs } from './CoinDetailsTabs';
import TraderSection from './TraderSection';

export const CoinDetailsExpanded: FC = () => {
  const [quote, setQuote] = useActiveQuote();
  const [upSideSize, setUpSideSize] = useSessionStorage<
    ResizableSidesValue | undefined
  >('coin-details-upside-sizes', '50%');
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-(--desktop-content-height) max-h-(--desktop-content-height) w-full min-w-0 max-w-full flex-nowrap justify-between">
      <div
        className="flex w-full flex-col overflow-auto border-white/10 border-r"
        ref={containerRef}
      >
        <CoinTitleWidget
          className="sticky top-0 z-10 h-16 shrink-0 border-white/10 border-b bg-v1-surface-l-current px-3"
          suffix={<CoinSentimentsWidget />}
        />
        <ResizableSides
          className={[
            'max-h-[calc(var(--desktop-content-height)-64px-36px)] min-h-52',
            'min-h-8',
            // clsx(
            //   upSideSize === '0%'
            //     ? '!h-[60px]'
            //     : upSideSize === '100%'
            //       ? '!h-[calc(100%-3rem)]'
            //       : '!max-h-[calc(100%-8rem)] !min-h-[8rem]',
            // ),
            // clsx(upSideSize === '100%' && 'overflow-hidden', 'h-full'),
          ]}
          direction="row"
          onChange={setUpSideSize}
          rootClassName="relative w-full min-w-0 shrink grow border-white/10"
          value={upSideSize}
        >
          {[
            <div className="flex h-full flex-col" key="up-side">
              <div className="grow">
                <CoinChart />
              </div>
            </div>,
            <Fragment key="down-side">
              <CoinDetailsTabs />
            </Fragment>,
          ]}
        </ResizableSides>
      </div>

      <div className="scrollbar-none sticky top-0 z-50 h-(--desktop-content-height) w-96 min-w-[360px] shrink overflow-y-auto bg-v1-surface-l0">
        <NCoinRisksBanner />
        <div className="space-y-3 px-3 pb-3">
          <TraderSection quote={quote} setQuote={setQuote} />
          <hr className="border-white/10" />
          <TokenUpdateWidget />
          <NCoinInsightWidget />
        </div>
      </div>
    </div>
  );
};
