import { useCoinOverview, useHasFlag } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { PriceAlertButton } from 'modules/insight/coinRadar/PageCoinRadarDetail/components/PriceAlertButton';

export default function MiniCoinPriceWidget({ slug }: { slug: string }) {
  const hasFlag = useHasFlag();
  const { data } = useCoinOverview({ slug });
  if (data?.data?.current_price == null) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs text-v1-content-secondary">Market Price</div>
        <div className="flex items-baseline justify-between gap-2">
          <ReadableNumber
            value={data?.data?.current_price}
            label="usdt"
            className="shrink-0 text-xl"
          />
          <PriceChange
            value={data?.data?.price_change_percentage_24h}
            textClassName="!text-sm"
          />
        </div>
      </div>
      {hasFlag('?set-alert') && (
        <div>
          <PriceAlertButton slug={slug} />
        </div>
      )}
    </div>
  );
}
