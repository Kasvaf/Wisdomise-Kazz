import { clsx } from 'clsx';
import { type FC } from 'react';
import { type Indicator } from 'api/market-pulse';

export const IndicatorIcon: FC<{
  className?: string;
  value: Indicator;
}> = ({ className, value }) => (
  <div
    className={clsx(
      'inline-flex size-6 items-center justify-center rounded-full bg-wsdm-gradient',
      value === 'rsi' ? 'text-[10px]' : 'text-[6px]',
      className,
    )}
  >
    {value.toUpperCase()}
  </div>
);
