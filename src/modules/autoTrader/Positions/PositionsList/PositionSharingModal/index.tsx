import { initialQuoteAsset, type Position, useLastPriceQuery } from 'api';
import { useCoinDetails } from 'api/discovery';
import logo from 'assets/logo-white.svg';
import { useRef, useState } from 'react';
import { Coin } from 'shared/Coin';
import PriceChange from 'shared/PriceChange';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import SharingModal from 'shared/ShareTools/SharingModal';
import { Toggle } from 'shared/Toggle';
import { formatNumber } from 'utils/numbers';
import autoTrader from './images/auto-trader.png';
import spaceship from './images/spaceship.png';

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

  const { data: lastPrice } = useLastPriceQuery({
    slug: position.base_slug,
    quote: position.quote_slug,
  });

  return (
    <SharingModal
      fileName={position.key}
      onClose={onClose}
      open={open}
      screenshotTarget={el}
    >
      <div>
        <div
          className="relative mb-2 overflow-hidden rounded-2xl bg-v1-surface-l1 p-5"
          ref={el}
        >
          <img alt="" className="absolute left-0 mt-10 px-10" src={spaceship} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <img alt="autoTrader" className="h-6" src={autoTrader} />
              <img alt="logo" className="h-5" src={logo} />
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
                  className="!flex justify-start text-3xl"
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
                  <span>
                    {position.entry_price} {position.quote_name}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>
                    {position.exit_price ? 'Exit Price' : 'Current Price'}
                  </span>
                  <span>
                    {position.exit_price ??
                      formatNumber(lastPrice ?? 0, {
                        compactInteger: false,
                        separateByComma: false,
                        decimalLength: 3,
                        minifyDecimalRepeats: false,
                      })}{' '}
                    {position.quote_name}
                  </span>
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
