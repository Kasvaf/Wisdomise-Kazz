import { clsx } from 'clsx';
import { useCoinOverview, useHasFlag } from 'api';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { PriceAlertButton } from './PriceAlertButton';

export function CoinPrice({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const hasFlag = useHasFlag();
  const coinOverview = useCoinOverview({ slug });
  return (
    <div
      className={clsx(!coinOverview.data && 'animate-pulse blur-sm', className)}
    >
      <Coin
        coin={
          coinOverview.data?.symbol ?? {
            name: '',
            abbreviation: '',
          }
        }
        nonLink
        className="text-base"
        imageClassName="size-11"
      />
      <div className="mt-4 flex items-end justify-between gap-2">
        <ReadableNumber
          value={coinOverview.data?.data?.current_price}
          label="usdt"
          className="shrink-0 text-4xl"
        />
        <PriceChange
          value={coinOverview.data?.data?.price_change_percentage_24h}
          suffix="(24h)"
          textClassName="!text-sm"
        />
      </div>
      {!hasFlag('/account/notification-center?tab=alerts') && (
        <div className="mt-8">
          <PriceAlertButton slug={slug} className="w-full" />
        </div>
      )}
    </div>
  );
}
