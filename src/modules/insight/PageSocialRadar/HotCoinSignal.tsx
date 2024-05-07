import { clsx } from 'clsx';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CoinsIcons from 'modules/shared/CoinsIcons';
import { type CoinSignal } from 'api';
import PriceChange from 'modules/shared/PriceChange';
import Icon from 'modules/shared/Icon';
import SideSuggestGauge from './SideSuggestGauge';

export default function HotCoinSignal({ data }: { data: CoinSignal }) {
  const { t } = useTranslation('social-radar');

  return (
    <NavLink
      to={`/insight/social-radar/${data.symbol_name}`}
      className="flex flex-col rounded-2xl bg-black/30 p-8 transition-colors hover:bg-black/20 mobile:p-5"
    >
      <div className="flex justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <CoinsIcons coins={[data.image]} />{' '}
          <span className="text-xl font-medium">{data.symbol_name}</span>
        </div>
        <p
          className={clsx(
            'text-lg text-white/80',
            !data.current_price && 'invisible',
          )}
        >
          {data.current_price} <span className="text-xs">USDT</span>
        </p>
      </div>
      <div className="flex justify-between border-b border-white/5 py-4">
        <div className="flex items-center gap-2">
          <SideSuggestGauge measure={data.gauge_measure} />
          <div>
            <p className="font-medium capitalize">
              {data.gauge_tag.toLowerCase()}
            </p>
            <p className="mt-2 text-xxs text-white/60">
              {t('hot-coins.side-suggest')}
            </p>
          </div>
        </div>

        <div
          className={clsx(
            'flex flex-col items-end justify-center gap-2',
            !data.price_change_percentage && 'invisible',
          )}
        >
          <PriceChange
            valueToFixed
            textClassName="!text-base"
            value={data.price_change_percentage || 0}
          />
          <p className="text-xxs text-white/60">{t('hot-coins.24-chg')}</p>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 text-sm opacity-40">
        <p className="leading-none">{t('hot-coins.signals')}</p>
        <Icon name={bxRightArrowAlt} />
      </div>
    </NavLink>
  );
}
