import * as numerable from 'numerable';
import PriceChange from 'modules/shared/PriceChange';

const RangedPnL: React.FC<{ range: string; value: number }> = ({
  range,
  value,
}) => {
  return (
    <div>
      <div className="text-xs text-white/40">{range}</div>
      <PriceChange value={value} />
    </div>
  );
};

const RangedVolume: React.FC<{ range: string; value: number }> = ({
  range,
  value,
}) => {
  return (
    <div>
      <div className="text-xs text-white/40">{range}</div>
      <div>
        <span className="text-white/40">$</span>
        <span>{numerable.format(value, '0,0.00')}</span>
      </div>
    </div>
  );
};

export default function CoinOverview() {
  return (
    <div className="flex items-center justify-between">
      <div className="text-3xl">
        <span className="text-white/40">$</span>
        <span>{numerable.format(42_912, '0,0.00')}</span>
      </div>

      <div className="flex gap-6">
        <RangedPnL range="1h" value={11.19} />
        <RangedPnL range="24h" value={-11.19} />
        <RangedPnL range="7d" value={-11.19} />
        <RangedPnL range="30d" value={11.19} />
      </div>

      <div className="flex gap-6">
        <RangedVolume range="24h Volume" value={17_815_274} />
        <RangedVolume range="Market Cap" value={17_815_274} />
      </div>
    </div>
  );
}
