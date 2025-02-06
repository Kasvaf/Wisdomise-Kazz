import { clsx } from 'clsx';
import { bxSync } from 'boxicons-quasar';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type Coin } from 'api/types/shared';
import Icon from 'shared/Icon';
import { ReactComponent as CapIcon } from './cap.svg';

export function CoinInfo({
  className,
  linesClassName,
  marketData,
  coin,
}: {
  className?: string;
  linesClassName?: string;
  coin: Coin;
  marketData: {
    circulating_supply?: null | number;
    current_price?: null | number;
    market_cap?: null | number;
    price_change_24h?: null | number;
    price_change_percentage_24h?: null | number;
    total_supply?: null | number;
  };
}) {
  return (
    <span className={clsx('inline-flex flex-col', className)}>
      <div className={clsx('flex items-center gap-2', linesClassName)}>
        <ReadableNumber value={marketData.current_price} label="$" />
        <DirectionalNumber
          value={marketData.price_change_percentage_24h}
          showSign
          className="text-[0.89em]"
          showIcon={false}
          suffix="(24H)"
          label="%"
        />
      </div>
      <div
        className={clsx(
          'flex items-center gap-2 text-[0.89em] text-v1-content-secondary',
          linesClassName,
        )}
      >
        <span className="inline-flex items-center gap-1">
          <CapIcon />
          <ReadableNumber value={marketData.market_cap} label="$" />
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name={bxSync} size={16} className="text-v1-content-secondary" />
          <ReadableNumber
            value={marketData.circulating_supply}
            label={coin.abbreviation}
          />
        </span>
      </div>
    </span>
  );
}
