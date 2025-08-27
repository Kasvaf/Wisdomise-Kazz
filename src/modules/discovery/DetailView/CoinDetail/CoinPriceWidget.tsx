import { bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { useUnifiedCoinDetails } from './lib';
import { PriceAlertButton } from './PriceAlertButton';

export const CoinPriceWidget: FC<{
  className?: string;
  hr?: boolean;
}> = ({ className, hr }) => {
  const { symbol, marketData } = useUnifiedCoinDetails();

  const [share, shareNotif] = useShare('copy');

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-between gap-1 overflow-auto',
          className,
        )}
      >
        <div className="grid grow grid-flow-col grid-rows-[1rem_auto] gap-px">
          <p className="text-v1-content-secondary text-xxs">{'Price'}</p>
          <DirectionalNumber
            className="text-sm"
            direction="up"
            label="$"
            showIcon={false}
            showSign={false}
            value={marketData.currentPrice}
          />

          <p className="text-v1-content-secondary text-xxs">{'MC'}</p>
          <ReadableNumber
            className="text-base"
            format={{
              decimalLength: 1,
            }}
            label="$"
            value={marketData.marketCap}
          />
        </div>
        <div className="flex items-center justify-end gap-1">
          <PriceAlertButton
            fab
            size="sm"
            slug={symbol.slug}
            surface={1}
            variant="outline"
          />
          <Button
            fab
            onClick={() =>
              share(`${window.location.origin}${window.location.pathname}`)
            }
            size="sm"
            surface={1}
            variant="outline"
          >
            <Icon name={bxShareAlt} />
          </Button>
          {shareNotif}
        </div>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
