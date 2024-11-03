import { clsx } from 'clsx';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type CoinSignal } from 'api';

export function CoinWhalesDetails({
  className,
  holdersData,
}: {
  className?: string;
  holdersData: CoinSignal['holders_data'];
}) {
  return (
    <span className={clsx('inline-flex flex-col', className)}>
      {holdersData ? (
        <>
          <div className="flex items-center gap-1">
            <DirectionalNumber
              value={holdersData.total_buy_number}
              direction="up"
              showSign={false}
              showIcon={false}
              popup="never"
              className="text-sm"
            />
            <span className="text-xs text-v1-content-secondary">
              (
              <ReadableNumber
                popup="never"
                value={holdersData.total_buy_volume}
                label="$"
              />
              )
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DirectionalNumber
              value={holdersData.total_sell_number}
              direction="down"
              showSign={false}
              showIcon={false}
              popup="never"
              className="text-sm"
            />
            <span className="text-xs text-v1-content-secondary">
              (
              <ReadableNumber
                popup="never"
                value={holdersData.total_sell_volume}
                label="$"
              />
              )
            </span>
          </div>
        </>
      ) : (
        <span className="text-sm text-v1-content-primary">{'Untracked'}</span>
      )}
    </span>
  );
}
