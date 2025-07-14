import { clsx } from 'clsx';
import { type FC } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReactComponent as BuySellIcon } from './buy_sell.svg';

export const NCoinBuySell: FC<{
  className?: string;
  imgClassName?: string;
  value?: {
    buys?: number | null;
    sells?: number | null;
  } | null;
}> = ({ className, imgClassName, value }) => {
  return (
    <div className={clsx('flex items-center justify-start gap-1', className)}>
      <BuySellIcon className={clsx('shrink-0', imgClassName)} />
      <DirectionalNumber
        value={value?.buys ?? 0}
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
        value={value?.sells ?? 0}
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
