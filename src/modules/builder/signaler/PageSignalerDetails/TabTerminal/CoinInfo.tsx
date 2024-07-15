import { clsx } from 'clsx';
import { Spin } from 'antd';
import { useSignalerPairDetails } from 'api';
import FancyPrice from 'shared/FancyPrice';
import PriceChange from 'shared/PriceChange';

const CoinInfo: React.FC<{ assetName: string; className?: string }> = ({
  assetName,
  className,
}) => {
  const { data: coinDetails, isLoading: detailsLoading } =
    useSignalerPairDetails(assetName);

  const containerClass = clsx(
    'flex h-14 grow items-center justify-around rounded-xl bg-black/40 py-2',
    className,
  );

  if (detailsLoading) {
    return (
      <div className={containerClass}>
        <Spin />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="text-2xl">
        <FancyPrice value={coinDetails?.price_data.last_price} />
      </div>
      {coinDetails?.price_data.percent_change_24h && (
        <>
          <div className="h-full border-r border-white/5" />
          <div className="text-xs">
            <div className="text-white/50">24h Change</div>
            <PriceChange value={coinDetails?.price_data.percent_change_24h} />
          </div>
        </>
      )}
      {coinDetails?.price_data.volume_24h && (
        <>
          <div className="h-full border-r border-white/5" />
          <div className="text-xs">
            <div className="text-white/50">24h Volume (USDT)</div>
            <FancyPrice value={coinDetails?.price_data.volume_24h} />
          </div>
        </>
      )}
    </div>
  );
};

export default CoinInfo;
