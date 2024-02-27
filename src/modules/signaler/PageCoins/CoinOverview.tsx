import { useTranslation } from 'react-i18next';
import { type PairDetails } from 'api/signaler';
import PriceChange from 'shared/PriceChange';
import FancyPrice from 'shared/FancyPrice';

const RangedPnL: React.FC<{ range: string; value: number }> = ({
  range,
  value,
}) => {
  if (!value && value !== 0) return <div />;

  return (
    <div className="mobile:grow">
      <div className="text-xs text-white/40">{range}</div>
      <PriceChange value={value} className="!justify-start" />
    </div>
  );
};

const RangedVolume: React.FC<{ range: string; value?: number }> = ({
  range,
  value,
}) => {
  if (!value && value !== 0) return <div />;
  return (
    <div className="mobile:grow">
      <div className="text-xs text-white/40">{range}</div>
      <FancyPrice value={value} />
    </div>
  );
};

const CoinOverview: React.FC<{ details?: PairDetails }> = ({ details }) => {
  const { t } = useTranslation('strategy');
  if (!details) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div className="text-3xl mobile:grow">
        <FancyPrice value={details.price_data.last_price} />
      </div>

      <div className="flex gap-6">
        <RangedVolume
          range={t('signaler.24h-volume')}
          value={details.price_data.volume_24h}
        />
        <RangedVolume
          range={t('signaler.market-cap')}
          value={details.price_data.market_cap}
        />
      </div>

      <div className="flex gap-6 mobile:grow">
        <RangedPnL range="1h" value={details.price_data.percent_change_1h} />
        <RangedPnL range="24h" value={details.price_data.percent_change_24h} />
        <RangedPnL range="7d" value={details.price_data.percent_change_7d} />
        <RangedPnL range="30d" value={details.price_data.percent_change_30d} />
      </div>
    </div>
  );
};

export default CoinOverview;
