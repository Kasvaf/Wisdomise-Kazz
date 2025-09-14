import { clsx } from 'clsx';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { type FC, Fragment } from 'react';
import {
  ResizableSides,
  type ResizableSidesValue,
} from 'shared/v1-components/ResizableSides';
import { useSessionStorage } from 'usehooks-ts';
import CoinChart from '../CoinChart';
import { CoinPriceWidget } from '../CoinPriceWidget';
import { CoinSentimentsWidget } from '../CoinSentimentsWidget';
import { CoinTitleWidget } from '../CoinTitleWidget';
import { CoinUpdateWidget } from '../CoinUpdateWidget';
import { NCoinInsightWidget } from '../NCoinInsightWidget';
import { NCoinRisksBanner } from '../NCoinRisksBanner';
import { CoinDetailsTabs } from './CoinDetailsTabs';
import TraderSection from './TraderSection';

export const CoinDetailsExpanded: FC = () => {
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
          clsx(upSideSize === '100%' && 'overflow-hidden', 'h-full'),
        ]}
        direction="row"
        onChange={setUpSideSize}
        rootClassName="relative h-(--desktop-content-height) max-h-(--desktop-content-height) w-full min-w-0 shrink grow border-r border-white/10"
        value={upSideSize}
      >
        {[
          <div className="flex h-full flex-col" key="up-side">
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
            <CoinDetailsTabs
              collapsable={upSideSize !== '100%'}
              expandable={upSideSize !== '0%'}
              onCollapse={() =>
                setUpSideSize(p => (p === '0%' ? '60%' : '100%'))
              }
              onExpand={() => setUpSideSize(p => (p === '100%' ? '60%' : '0%'))}
              onTabChange={() => setUpSideSize(p => (p === '100%' ? '60%' : p))}
            />
          </Fragment>,
        ]}
      </ResizableSides>

      {/* Trade + Additional */}
      <div className="scrollbar-none sticky top-(--desktop-content-top) z-50 h-(--desktop-content-height) w-96 min-w-[360px] shrink overflow-y-auto bg-v1-surface-l0">
        <NCoinRisksBanner />
        <CoinPriceWidget className="h-16 px-3" hr />
        <div className="space-y-3 px-3 pb-3">
          <TraderSection quote={quote} setQuote={setQuote} />
          <hr className="border-white/10" />
          <NCoinInsightWidget />
          <CoinUpdateWidget />
        </div>
      </div>
    </div>
  );
};
