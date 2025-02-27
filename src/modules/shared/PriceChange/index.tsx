import { clsx } from 'clsx';
import type React from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as PriceDownIcon } from './down.svg';
import { ReactComponent as PriceUpIcon } from './up.svg';

interface Props {
  bg?: boolean;
  staticValue?: number | null;
  value?: number | null;
  suffix?: string;
  colorize?: boolean;
  valueToFixed?: boolean; // no need anymore
  className?: string;
  textClassName?: string;
  numberClassName?: string;
  popup?: 'auto' | 'always' | 'never';
}

const PriceChange: React.FC<Props> = ({
  staticValue,
  value,
  bg,
  suffix,
  className,
  textClassName,
  numberClassName,
  colorize = true,
  popup,
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
      ? 'text-v1-content-primary'
      : color === 'green'
      ? 'text-v1-content-positive'
      : 'text-v1-content-negative';

  return (
    <div
      className={clsx(
        'inline-flex flex-nowrap items-center justify-center gap-1',
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

      <div
        className={clsx(
          'whitespace-nowrap font-medium',
          textColor,
          textClassName,
        )}
      >
        {typeof staticValue === 'number' && (
          <>
            <ReadableNumber value={staticValue} popup={popup} />
            {' ('}
          </>
        )}
        <ReadableNumber
          value={typeof value === 'number' ? Math.abs(value) : undefined}
          format={{
            minifyDecimalRepeats: false,
            decimalLength: 2,
            seperateByComma: true,
            compactInteger: true,
          }}
          label="%"
          popup={popup}
          className={numberClassName}
        />
        {typeof staticValue === 'number' && ')'}
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
};

export default PriceChange;
