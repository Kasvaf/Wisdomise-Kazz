import { clsx } from 'clsx';
import type React from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as PriceDownIcon } from './priceDown.svg';
import { ReactComponent as PriceUpIcon } from './priceUp.svg';

interface Props {
  bg?: boolean;
  value?: number | null;
  suffix?: string;
  colorize?: boolean;
  valueToFixed?: boolean; // no need anymore
  className?: string;
  textClassName?: string;
}

const PriceChange: React.FC<Props> = ({
  value,
  bg,
  suffix,
  className,
  textClassName,
  colorize = true,
}) => {
  if (value == null || Number.isNaN(+value)) return <div className="p-2" />;

  const bgColorized = value >= 0 ? 'bg-[#43D76E0D]' : 'bg-[#F140560D]';
  const bgColor = colorize ? bgColorized : 'bg-white/5';

  const textColorized = value >= 0 ? 'text-[#40F19C]' : 'text-[#F14056]';
  const textColor = colorize ? textColorized : 'text-white';

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        bg && 'rounded-xl p-2',
        bg && bgColor,
        className,
      )}
    >
      <div className={clsx(textColor)}>
        {value >= 0 ? <PriceUpIcon /> : <PriceDownIcon />}
      </div>

      <p
        className={clsx(
          'ml-[5px] text-xs font-medium',
          textColor,
          textClassName,
        )}
      >
        <ReadableNumber value={Math.abs(value)} label="%" />
        {suffix && <span>{suffix}</span>}
        {/* {valueToFixed ? roundSensible(value) : Math.abs(value)} % */}
      </p>
    </div>
  );
};

export default PriceChange;
