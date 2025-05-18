import { clsx } from 'clsx';
import { type FC } from 'react';
import { type NetworkRadarNCoin } from 'api/insight/network';
import { ReadableNumber } from 'shared/ReadableNumber';
import volume from './volume.png';

export const NCoinTradingVolume: FC<{
  className?: string;
  imgClassName?: string;
  value?: NetworkRadarNCoin | null;
}> = ({ className, imgClassName, value }) => {
  return (
    <div className={clsx('flex items-center justify-start gap-px', className)}>
      <img src={volume} className={clsx('shrink-0', imgClassName)} />
      <ReadableNumber
        value={value?.update.total_trading_volume.usd}
        label="$"
        popup="never"
        format={{
          decimalLength: 1,
        }}
      />
    </div>
  );
};
