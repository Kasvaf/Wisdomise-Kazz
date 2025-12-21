import { clsx } from 'clsx';
import type { FC } from 'react';
import type { Indicator } from 'services/rest/discovery';

export const IndicatorIcon: FC<{
  className?: string;
  value: Indicator;
}> = ({ className, value }) => (
  <div
    className={clsx(
      'inline-flex size-6 items-center justify-center rounded-full bg-brand-gradient',
      value === 'rsi' ? 'text-[10px]' : 'text-[6px]',
      className,
    )}
  >
    {value.toUpperCase()}
  </div>
);
