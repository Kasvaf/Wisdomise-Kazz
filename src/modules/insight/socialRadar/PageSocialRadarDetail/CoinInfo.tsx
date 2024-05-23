import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as numerable from 'numerable';
import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { useCoinSignals } from 'api';
import CoinsIcons from 'shared/CoinsIcons';
import PriceChange from 'shared/PriceChange';
import SideSuggestGauge from '../PageSocialRadar/SideSuggestGauge';

export default function CoinInfo() {
  const signals = useCoinSignals();
  const { t } = useTranslation('social-radar');
  const params = useParams<{ symbol: string }>();
  const info = signals.data?.find(sig => sig.symbol_name === params.symbol);

  if (!info) return null;

  return (
    <section
      className={clsx(
        'mb-8 grid h-[72px] grid-cols-6 rounded-lg bg-black/20 p-3',
        '[&>div:first-child]:pl-0 [&>div:last-child]:border-none [&>div:last-child]:pr-0 [&>div]:border-r [&>div]:border-white/5 [&>div]:px-5',
        'mobile:h-auto mobile:grid-cols-2 mobile:gap-y-6 mobile:[&>div:first-child]:pl-5 mobile:[&>div:last-child]:pr-5',
        'mobile:px-0 mobile:[&>div:nth-child(2n)]:!border-r-0 ',
      )}
    >
      <div className="flex items-center gap-2 mobile:justify-center">
        <CoinsIcons coins={[info.image || '']} />
        <p className="text-xl font-medium">{params.symbol}</p>
      </div>

      <div className="flex items-center gap-2 mobile:justify-center">
        <SideSuggestGauge measure={info.gauge_measure} />
        <div>
          <p className="font-medium capitalize">
            {info.gauge_tag.toLowerCase()}
          </p>
          <p className="mt-2 text-xxs text-white/60">
            {t('hot-coins.side-suggest')}
          </p>
        </div>
      </div>

      <InfoSection
        title="Price"
        value={
          <>
            {info.current_price}
            <span className="ml-[2px] text-xs">USDT</span>
          </>
        }
      />

      <InfoSection
        title="24h Chg"
        value={
          <PriceChange
            valueToFixed
            textClassName="!text-base !leading-none"
            value={info.price_change_percentage || 0}
          />
        }
      />

      <InfoSection
        title="Market Cap"
        value={
          <>
            <span className="font-light text-white/40">$</span>
            {numerable.format(info.market_cap, '0,0')}
          </>
        }
      />

      <InfoSection
        title="Volume 24h"
        value={
          <>
            <span className="font-light text-white/40">$</span>
            {numerable.format(info.total_volume, '0,0')}
          </>
        }
      />
    </section>
  );
}

const InfoSection = (props: { title: string; value: ReactNode }) => (
  <div className="flex h-full flex-col items-center justify-between">
    <p className="text-xs font-light text-white/60">{props.title}</p>
    <p className="text-white/80 mobile:mt-3 mobile:text-sm">{props.value}</p>
  </div>
);
