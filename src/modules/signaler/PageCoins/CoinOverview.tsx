import PriceChange from 'modules/shared/PriceChange';
import { useSignalerPairDetails } from 'api/signaler';
import Spinner from 'modules/shared/Spinner';
import FancyPrice from 'modules/shared/FancyPrice';

const RangedPnL: React.FC<{ range: string; value: number }> = ({
  range,
  value,
}) => {
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

const CoinOverview: React.FC<{ name: string }> = ({ name }) => {
  const { data, isLoading } = useSignalerPairDetails(name);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div className="text-3xl mobile:grow">
        <FancyPrice value={data.price_data.last_price} />
      </div>

      <div className="flex gap-6">
        <RangedVolume range="24h Volume" value={data.price_data.volume_24h} />
        <RangedVolume range="Market Cap" value={data.price_data.market_cap} />
      </div>

      <div className="flex gap-6 mobile:grow">
        <RangedPnL range="1h" value={data.price_data.percent_change_1h} />
        <RangedPnL range="24h" value={data.price_data.percent_change_24h} />
        <RangedPnL range="7d" value={data.price_data.percent_change_7d} />
        <RangedPnL range="30d" value={data.price_data.percent_change_30d} />
      </div>
    </div>
  );
};

export default CoinOverview;
