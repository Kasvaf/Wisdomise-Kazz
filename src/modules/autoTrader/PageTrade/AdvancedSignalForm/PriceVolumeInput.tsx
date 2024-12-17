import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useMainQuote } from 'api';
import { roundSensible } from 'utils/numbers';
import { toAmount } from 'shared/AmountInputBox';

const InternalInput: React.FC<{
  value: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
  readonly?: boolean;
  className?: string;
}> = ({ value, onChange, onBlur, readonly, className }) => {
  const [ref, setRef] = useState<HTMLInputElement | null>(null);
  const resize = () => {
    if (ref) {
      ref.style.setProperty('overflow-x', 'scroll', 'important');
      ref.style.width = '1px';
      ref.style.width = `${Math.max(
        ref.scrollWidth,
        127 +
          10 * value.replaceAll('1', '').length +
          5 * value.replaceAll(/[^1]/g, '').length,
      )}px`;
      ref.style.removeProperty('overflow-x');
    }
  };
  useEffect(resize, [ref, value]);

  return (
    <input
      ref={setRef}
      value={value}
      onChange={resize}
      className={clsx(
        '-mr-32 max-w-[calc(40%+128px)] bg-transparent pr-32 outline-none',
        readonly && 'text-white/50',
        className,
      )}
      onInput={(e: any) => {
        const val = toAmount(e.target.value);
        onChange?.(val);
        e.target.value = val;
      }}
      onBlur={onBlur}
      readOnly={readonly}
    />
  );
};

const PriceVolumeInput: React.FC<{
  label?: string;
  price: string;
  volume: string;
  onPriceChange?: (p: string) => void;
  onPriceBlur?: () => void;
  onVolumeChange?: (p: string) => void;
  onVolumeBlur?: () => void;
  appliedAt?: Date;
  disabledPrice?: boolean;
  disabledVolume?: boolean;
  className?: string;
}> = ({
  label,
  price,
  volume,
  onPriceChange,
  onPriceBlur,
  onVolumeChange,
  onVolumeBlur,
  appliedAt,
  disabledPrice,
  disabledVolume,
  className,
}) => {
  const mainQuote = useMainQuote();
  const disVol = !!appliedAt || disabledVolume;
  const disPrc = !!appliedAt || disabledPrice;

  return (
    <div className={clsx('w-full', className)}>
      {label && <label className="mb-2 ml-2 block">{label}</label>}
      <div className="flex h-10 items-center overflow-x-hidden rounded-lg bg-black/30 pr-2">
        <InternalInput
          value={disVol ? roundSensible(volume) : volume}
          onChange={onVolumeChange}
          onBlur={() => {
            onVolumeChange?.(
              +volume < 0 ? '0' : +volume > 100 ? '100' : volume,
            );
            onVolumeBlur?.();
          }}
          readonly={disVol}
          className="pl-2"
        />
        <span
          className={clsx(
            'pointer-events-none ml-[2px] select-none',
            disPrc && 'text-white/50',
          )}
        >
          %
        </span>
        <span className="pointer-events-none ml-2 select-none text-white/50">
          at
        </span>
        <InternalInput
          value={disPrc ? roundSensible(price) : price}
          onChange={onPriceChange}
          onBlur={onPriceBlur}
          readonly={disPrc}
          className="pl-2"
        />
        <span className="pointer-events-none ml-1 select-none text-xs text-white/50">
          {mainQuote}
        </span>

        <div className="grow" />
        {appliedAt && (
          <span className="ml-1 min-w-16 select-none text-xxs text-white/50">
            {dayjs(appliedAt).format('D MMM HH:mm')}
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceVolumeInput;
