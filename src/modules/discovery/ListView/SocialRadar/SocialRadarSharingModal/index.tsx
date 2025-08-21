import type { SocialRadarCoin } from 'api/discovery';
import logo from 'assets/logo-white.svg';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Coin } from 'shared/Coin';
import { CoinLabels } from 'shared/CoinLabels';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import SharingModal from 'shared/ShareTools/SharingModal';
import { SocialRadarSentiment } from '../SocialRadarSentiment';
import { ReactComponent as SocialRadarIcon } from '../social-radar.svg';
import radar from './images/radar.png';
import sparkle from './images/sparkle.png';

export interface SocialRadarSharingModalProps {
  open: boolean;
  onClose?: () => void;
  coin: SocialRadarCoin;
}

export default function SocialRadarSharingModal({
  open,
  onClose,
  coin,
}: SocialRadarSharingModalProps) {
  const el = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('insight');

  return (
    <SharingModal
      fileName={`${coin.symbol.abbreviation ?? ''}-${new Date().toISOString()}`}
      onClose={() => onClose?.()}
      open={open}
      screenshotTarget={el}
    >
      <div
        className="pointer-events-none relative mb-2 overflow-hidden rounded-2xl bg-v1-surface-l1 p-5"
        ref={el}
      >
        <img
          alt=""
          className="absolute top-0 left-0 w-full opacity-50"
          src={sparkle}
        />
        <img alt="" className="absolute top-0 left-0 w-full" src={radar} />
        <div className="relative">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <SocialRadarIcon className="size-5" />
              Social Radar
            </div>
            <div className="relative">
              <img alt="logo" className="h-7" src={logo} />
              <span className="-bottom-3 absolute right-2 font-light text-xxs">
                goatx.trade
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
              className="!overflow-visible shrink-0 text-3xl"
              label="$"
              value={coin.symbol_market_data?.current_price}
            />
            <PriceChange
              suffix="(24H)"
              value={coin.symbol_market_data?.price_change_percentage_24h}
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-1/2 rounded-xl bg-white/5 px-3 py-2 text-xs">
              <p className="mb-1 text-v1-content-secondary">Market Cap</p>
              <ReadableNumber
                label="$"
                value={coin.symbol_market_data?.market_cap}
              />
            </div>
            <div className="w-1/2 rounded-xl bg-white/5 px-3 py-2 text-xs">
              <p className="mb-1 text-v1-content-secondary">Timestamp (UTC)</p>
              <p>{dayjs(new Date()).utc().format('D MMMM YYYY h:mm A')}</p>
            </div>
          </div>
          {coin?.signals_analysis && (
            <SocialRadarSentiment
              className="mt-2 w-full"
              coin={coin.symbol}
              contentClassName="!bg-white/5"
              marketData={coin.symbol_market_data}
              mode="expanded"
              value={coin}
            />
          )}
          <div className="my-4 flex flex-col items-start justify-end overflow-auto">
            <p className="mb-1 text-xxs">{t('pre_detail_modal.wise_labels')}</p>
            <CoinLabels
              categories={coin.symbol.categories}
              clickable={false}
              labels={coin.symbol_labels}
              networks={coin.networks}
              security={coin.symbol_security?.data}
              size="md"
            />
          </div>
          {coin?.signals_analysis.sparkline && (
            <CoinPriceChart
              value={coin?.signals_analysis.sparkline.prices ?? []}
            />
          )}
          <ReferralQrCode />
        </div>
      </div>
    </SharingModal>
  );
}
