import { clsx } from 'clsx';
import type React from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as PriceDownIcon } from './priceDown.svg';
import { ReactComponent as PriceUpIcon } from './priceUp.svg';

interface Props {
  bg?: boolean;
  staticValue?: number | null;
  value?: number | null;
  colorize?: boolean;
  valueToFixed?: boolean; // no need anymore
  className?: string;
  textClassName?: string;
}

const PriceChange: React.FC<Props> = ({
  staticValue,
  value,
  bg,
  className,
  textClassName,
  colorize = true,
}) => {
  const color =
    typeof value === 'number' ? (value >= 0 ? 'green' : 'red') : null;

  const bgColor =
    !colorize || !color
      ? 'bg-white/5'
      : color === 'green'
      ? 'bg-[#43D76E0D]'
      : 'bg-[#F140560D]';

  const textColor =
    !colorize || !color
      ? 'text-white'
      : color === 'green'
      ? 'text-[#40F19C]'
      : 'text-[#F14056]';

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        bg && 'rounded-xl p-2',
        bg && bgColor,
        className,
      )}
    >
      <div className={textColor}>
        {color === 'green' ? (
          <PriceUpIcon />
        ) : color === 'red' ? (
          <PriceDownIcon />
        ) : null}
      </div>

      <p
        className={clsx(
          'ml-[5px] text-xs font-medium',
          textColor,
          textClassName,
        )}
      >
        {typeof staticValue === 'number' && (
          <>
            <ReadableNumber value={staticValue} />
            {' ('}
          </>
        )}
        <ReadableNumber
          value={typeof value === 'number' ? Math.abs(value) : undefined}
          label="%"
        />
        {typeof staticValue === 'number' && ')'}
      </p>
    </div>
  );
};

export default PriceChange;
