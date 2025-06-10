import { useRef } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import SharingModal from 'shared/ShareTools/SharingModal';
import logo from 'shared/ShareTools/images/logo.png';
import { Coin } from 'shared/Coin';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import { type TechnicalRadarCoin } from 'api/discovery';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { CoinLabels } from 'shared/CoinLabels';
import { ReactComponent as TechnicalRadarIcon } from '../technical-radar.svg';
import { TechnicalRadarSentiment } from '../TechnicalRadarSentiment';
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
  const { t } = useTranslation('insight');

  return (
    <SharingModal
      open={open}
      onClose={() => onClose?.()}
      fileName={`${coin.symbol.abbreviation ?? ''}-${new Date().toISOString()}`}
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
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TechnicalRadarIcon className="size-5" />
              Technical Radar
            </div>
            <div className="relative">
              <img src={logo} alt="logo" className="h-7" />
              <span className="absolute -bottom-3 right-0 text-xxs font-light">
                wisdomise.com
              </span>
            </div>
          </div>
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
              className="shrink-0 !overflow-visible text-3xl"
            />
            <PriceChange
              value={coin.data?.price_change_percentage_24h}
              suffix="(24H)"
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-1/2 rounded-xl bg-white/5 px-3 py-2 text-xs">
              <p className="mb-1 text-v1-content-secondary">Market Cap</p>
              <ReadableNumber value={coin.data?.market_cap} label="$" />
            </div>
            <div className="w-1/2 rounded-xl bg-white/5 px-3 py-2 text-xs">
              <p className="mb-1 text-v1-content-secondary">Timestamp (UTC)</p>
              <p>{dayjs(new Date()).utc().format('D MMMM YYYY h:mm A')}</p>
            </div>
          </div>
          {coin && (
            <TechnicalRadarSentiment
              mode="card"
              coin={coin.symbol}
              marketData={coin.data}
              value={coin}
              className="mt-2 w-full"
              contentClassName="!bg-white/5"
            />
          )}
          <div className="my-4 flex flex-col items-start justify-end overflow-auto">
            <p className="mb-1 text-xxs">{t('pre_detail_modal.wise_labels')}</p>
            <CoinLabels
              categories={coin.symbol.categories}
              labels={coin.symbol_labels}
              networks={coin.networks}
              security={coin.symbol_security?.data}
              coin={coin.symbol}
              size="md"
              clickable={false}
            />
          </div>
          {coin?.sparkline && (
            <CoinPriceChart value={coin?.sparkline?.prices ?? []} />
          )}
          <ReferralQrCode />
        </div>
      </div>
    </SharingModal>
  );
}
