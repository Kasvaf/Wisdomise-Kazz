import { useRef } from 'react';
import dayjs from 'dayjs';
import SharingModal from 'shared/ShareTools/SharingModal';
import logo from 'shared/ShareTools/images/logo.png';
import { Coin } from 'shared/Coin';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import { type TechnicalRadarCoin } from 'api';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { TechnicalRadarSentimentWidget } from 'modules/insight/PageCoinDetails/components/TechnicalRadarSentimentWidget';
import gradient from './images/gradient.png';
import sparkle from './images/sparkle.png';
import radar from './images/radar.png';

export interface TechnicalRadarSharingModalProps {
  open: boolean;
  onClose?: () => void;
  coin: TechnicalRadarCoin;
}

export default function TechnicalRadarSharingModal({
  open,
  onClose,
  coin,
}: TechnicalRadarSharingModalProps) {
  const el = useRef<HTMLDivElement>(null);

  return (
    <SharingModal
      open={open}
      onClose={() => onClose?.()}
      fileName={`${coin.symbol.abbreviation}-${new Date().toISOString()}`}
      screenshotTarget={el}
    >
      <div
        ref={el}
        className="pointer-events-none relative mb-2 overflow-hidden rounded-2xl bg-v1-surface-l1 p-5"
      >
        <img
          src={sparkle}
          alt=""
          className="absolute left-0 top-0 w-full opacity-50"
        />
        <img src={radar} alt="" className="absolute left-0 top-0 w-full" />
        <img src={gradient} alt="" className="absolute left-0 top-0 w-full" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span>Technical Radar</span>
            <img src={logo} alt="logo" className="h-5" />
          </div>
          <hr className="my-4 border-v1-border-primary/10" />
          {coin && (
            <Coin
              coin={coin.symbol}
              noCors={true}
              nonLink={true}
              truncate={false}
            />
          )}
          <div className="mt-4 flex items-end gap-2">
            <ReadableNumber
              value={coin.data?.current_price}
              label="$"
              className="shrink-0 text-3xl"
            />
            <PriceChange
              value={coin.data?.price_change_percentage_24h}
              numberClassName="!overflow-visible" // for screenshot
              suffix="(24H)"
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="grow rounded-xl bg-white/5 px-3 py-2 text-xs">
              <p className="mb-1 text-v1-content-secondary">Market Cap</p>
              <ReadableNumber value={coin.data?.market_cap} label="$" />
            </div>
            <div className="grow rounded-xl bg-white/5 px-3 py-2 text-xs">
              <p className="mb-1 text-v1-content-secondary">Timestamp</p>
              <p>{dayjs(new Date()).format('D MMMM YYYY')}</p>
            </div>
          </div>
          {coin && (
            <TechnicalRadarSentimentWidget
              slug={coin.symbol.slug}
              className="mt-2 w-full"
              contentClassName="!bg-white/5"
            />
          )}
          {coin?.sparkline && (
            <CoinPriceChart value={coin?.sparkline?.prices ?? []} />
          )}
          <ReferralQrCode />
        </div>
      </div>
    </SharingModal>
  );
}
