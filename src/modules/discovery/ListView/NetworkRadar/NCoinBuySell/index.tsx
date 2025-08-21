import { clsx } from 'clsx';
import type { FC } from 'react';
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
    <div
      className={clsx(
        'inline-flex items-center justify-start gap-1',
        className,
      )}
    >
      <BuySellIcon className={clsx('shrink-0', imgClassName)} />
      <DirectionalNumber
        direction="up"
        format={{
          decimalLength: 1,
        }}
        popup="never"
        showIcon={false}
        showSign={false}
        value={value?.buys ?? 0}
      />
      <span className="-mx-1 scale-50 text-v1-content-secondary">/</span>
      <DirectionalNumber
        direction="down"
        format={{
          decimalLength: 1,
        }}
        popup="never"
        showIcon={false}
        showSign={false}
        value={value?.sells ?? 0}
      />
    </div>
  );
};
