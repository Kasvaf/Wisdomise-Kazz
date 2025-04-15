import { clsx } from 'clsx';
import { type FC } from 'react';
import { type NetworkRadarPool } from 'api/insight/network';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReactComponent as BuySellIcon } from './buy_sell.svg';

export const PoolBuySell: FC<{
  className?: string;
  imgClassName?: string;
  value?: NetworkRadarPool | null;
}> = ({ className, imgClassName, value }) => {
  return (
    <div className={clsx('flex items-center justify-start gap-1', className)}>
      <BuySellIcon className={clsx('shrink-0', imgClassName)} />
      <DirectionalNumber
        value={value?.update.total_num_buys}
        direction="up"
        popup="never"
        showIcon={false}
        showSign={false}
        format={{
          decimalLength: 1,
        }}
      />
      <span className="-mx-px text-v1-content-secondary">/</span>
      <DirectionalNumber
        value={value?.update.total_num_sells}
        direction="down"
        popup="never"
        showIcon={false}
        showSign={false}
        format={{
          decimalLength: 1,
        }}
      />
    </div>
  );
};
