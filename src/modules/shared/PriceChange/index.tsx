import { clsx } from 'clsx';
import type React from 'react';
import { ReactComponent as PriceDownIcon } from './priceDown.svg';
import { ReactComponent as PriceUpIcon } from './priceUp.svg';

interface Props {
  bg?: boolean;
  value: number;
  colorize?: boolean;
  className?: string;
  valueToFixed?: boolean;
}

export const PriceChange: React.FC<Props> = ({
  value,
  bg,
  className,
  valueToFixed,
  colorize = true,
}) => {
  const bgColor = colorize
    ? bg && (value >= 0 ? 'bg-[#43D76E0D]' : 'bg-[#F140560D]')
    : bg && 'bg-white/5';

  const textColor = colorize
    ? value >= 0
      ? 'text-[#40F19C]'
      : 'text-[#F14056]'
    : 'text-white';

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        bg && 'rounded-xl p-2',
        bgColor,
        className,
      )}
    >
      <div className={clsx(textColor)}>
        {value >= 0 ? <PriceUpIcon /> : <PriceDownIcon />}
      </div>

      <p className={clsx('ml-[5px] text-xs font-medium', textColor)}>
        {valueToFixed ? Math.abs(value).toFixed(2) : Math.abs(value)} %
      </p>
    </div>
  );
};
