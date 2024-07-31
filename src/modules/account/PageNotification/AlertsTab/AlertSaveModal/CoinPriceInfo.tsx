import { type FC } from 'react';
import { clsx } from 'clsx';
import { type CoinSignal } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as PriceIcon } from './price.svg';

export const CoinPriceInfo: FC<{
  coinInfo?: CoinSignal;
  loading?: boolean;
  className?: string;
}> = ({ coinInfo, loading, className }) => (
  <div
    className={clsx(
      'flex items-center gap-1 py-6 text-xs',
      loading ? 'animate-pulse blur-sm' : !coinInfo && 'hidden',
      className,
    )}
  >
    <PriceIcon />
    {'The price of '}
    <span className="text-sky-400">{coinInfo?.symbol_name.toUpperCase()}</span>
    {' is currently '}
    <ReadableNumber
      className="text-sky-400"
      value={coinInfo?.current_price || 0}
      label="usdt"
    />
  </div>
);
