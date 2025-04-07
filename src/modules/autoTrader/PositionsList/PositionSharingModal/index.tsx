import { useRef, useState } from 'react';
import { Toggle } from 'shared/Toggle';
import { Coin } from 'shared/Coin';
import {
  initialQuoteAsset,
  type Position,
  useCoinDetails,
  useLastPriceQuery,
} from 'api';
import PriceChange from 'shared/PriceChange';
import logo from 'shared/ShareTools/images/logo.png';
import SharingModal from 'shared/ShareTools/SharingModal';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import autoTrader from './images/auto-trader.png';
import spaceship from './images/spaceship.png';
import gradient1 from './images/gradient-1.png';
import gradient2 from './images/gradient-2.png';
import logoOutline from './images/logo-outline.png';

export default function PositionSharingModal({
  open,
  onClose,
  position,
}: {
  open: boolean;
  position: Position;
  onClose: () => void;
}) {
  const [showExtra, setShowExtra] = useState(false);

  const { data: coin } = useCoinDetails({
    slug: position.base_slug ?? 'tether',
  });
  const initialQuote = initialQuoteAsset(position);
  const el = useRef<HTMLDivElement>(null);

  const { data: lastPrice } = useLastPriceQuery({ slug: position.base_slug });

  return (
    <SharingModal
      open={open}
      onClose={onClose}
      fileName={position.key}
      screenshotTarget={el}
    >
      <div>
        <div
          ref={el}
          className="relative mb-2 overflow-hidden rounded-2xl bg-v1-surface-l1 p-5"
        >
          <img src={spaceship} alt="" className="absolute left-0 mt-10 px-10" />
          <img
            src={logoOutline}
            alt=""
            className="absolute left-0 top-0 w-4/5"
          />
          <img
            src={gradient1}
            alt=""
            className="absolute left-0 top-0 h-full w-full"
          />
          <img
            src={gradient2}
            alt=""
            className="absolute left-0 top-0 h-full w-full"
          />
          <div className="relative">
            <div className="flex items-center justify-between">
              <img src={autoTrader} alt="autoTrader" className="h-6" />
              <img src={logo} alt="logo" className="h-5" />
            </div>
            <hr className="my-4 border-v1-border-primary/10" />
            <div className="flex flex-col items-start">
              {coin && (
                <Coin
                  coin={coin.symbol}
                  noCors={true}
                  nonLink={true}
                  truncate={false}
                />
              )}
              <div className="my-6">
                <PriceChange
                  className="!flex text-3xl"
                  value={Number(position.pnl)}
                />
                {showExtra && (
                  <div
                    className={
                      Number(position.pnl) >= 0
                        ? 'text-v1-content-positive'
                        : 'text-v1-content-negative'
                    }
                  >
                    {position.pnl_quote?.toFixed(3)} {position.quote_name}
                    {position.quote_name !== 'USDT' &&
                      `(${position.pnl_usd?.toFixed(3) ?? ''})`}
                  </div>
                )}
              </div>
              <div className="min-w-36 text-sm">
                {showExtra && (
                  <div className="flex justify-between gap-3">
                    <span>Invest</span>
                    <span>
                      {initialQuote?.amount} {initialQuote?.asset_name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <span>Entry Price</span>
                  <span>{position.entry_price}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Exit Price</span>
                  <span>{position.exit_price ?? lastPrice?.toFixed(3)}</span>
                </div>
              </div>
            </div>
            <ReferralQrCode className="mt-4" />
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between rounded-xl bg-v1-surface-l1 px-3 py-4 text-xs">
          Display Investment Amount and Profit/Loss
          <Toggle checked={showExtra} onChange={setShowExtra} />
        </div>
      </div>
    </SharingModal>
  );
}
