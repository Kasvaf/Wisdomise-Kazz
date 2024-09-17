import { clsx } from 'clsx';
import { useCoinOverview } from 'api';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { OverviewWidget } from 'shared/OverviewWidget';
import { PriceAlertButton } from './PriceAlertButton';

export function CoinPriceWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const coinOverview = useCoinOverview({ slug });
  return (
    <OverviewWidget
      className={clsx('min-h-[233px] mobile:min-h-[213px]', className)}
      loading={coinOverview.isLoading}
      empty={coinOverview.data?.data?.current_price === null}
    >
      <Coin
        coin={
          coinOverview.data?.symbol ?? {
            name: '',
            abbreviation: '',
          }
        }
        truncate={false}
        nonLink
        className="text-base"
        imageClassName="size-11"
      />
      <div className="mt-4 flex items-baseline justify-between gap-2">
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
      <div className="mt-8">
        <PriceAlertButton slug={slug} className="w-full" />
      </div>
    </OverviewWidget>
  );
}
