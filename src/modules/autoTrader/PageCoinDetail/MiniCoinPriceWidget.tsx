import { useCoinOverview, useHasFlag, useLastPriceQuery } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { PriceAlertButton } from 'modules/insight/coinRadar/PageCoinRadarDetail/components/PriceAlertButton';
import { DebugPin } from 'shared/DebugPin';

export default function MiniCoinPriceWidget({ slug }: { slug: string }) {
  const hasFlag = useHasFlag();
  const { data } = useCoinOverview({ slug });
  const { data: lastPrice } = useLastPriceQuery({ slug, exchange: 'STONFI' });
  if (lastPrice == null) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs text-v1-content-secondary">Market Price</div>
        <div className="flex items-baseline justify-between gap-2">
          <ReadableNumber
            value={lastPrice}
            label="usdt"
            className="shrink-0 text-xl"
          />
          <PriceChange
            value={data?.data?.price_change_percentage_24h}
            textClassName="!text-sm"
          />
        </div>
      </div>

      {hasFlag('/trader-alerts') && (
        <div>
          <DebugPin value="/trader-alerts" />
          <PriceAlertButton slug={slug} />
        </div>
      )}
    </div>
  );
}
