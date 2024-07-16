import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toAmount } from 'shared/AmountInputBox';

const InternalInput: React.FC<{
  value: string;
  onChange?: (v: string) => void;
  readonly?: boolean;
  className?: string;
}> = ({ value, onChange, readonly, className }) => {
  const [ref, setRef] = useState<HTMLInputElement | null>(null);
  const resize = () => {
    if (ref) {
      ref.style.width = '1px';
      ref.style.width = `${ref.scrollWidth}px`;
    }
  };
  useEffect(resize, [ref]);

  return (
    <input
      ref={setRef}
      value={value}
      onChange={resize}
      className={clsx(
        'bg-transparent outline-none',
        readonly && 'text-white/50',
        className,
      )}
      onInput={(e: any) => {
        const val = toAmount(e.target.value);
        onChange?.(val);
        e.target.value = val;
      }}
      readOnly={readonly}
    />
  );
};

const PriceVolumeInput: React.FC<{
  price: string;
  volume: string;
  onPriceChange?: (p: string) => void;
  onVolumeChange?: (p: string) => void;
  appliedAt?: Date;
  disabledPrice?: boolean;
  disabledVolume?: boolean;
  className?: string;
}> = ({
  price,
  volume,
  onPriceChange,
  onVolumeChange,
  appliedAt,
  disabledPrice,
  disabledVolume,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex h-10 items-center rounded-lg bg-black/30 px-2',
        className,
      )}
    >
      <InternalInput
        value={price}
        onChange={onPriceChange}
        readonly={!!appliedAt || disabledPrice}
        className="pr-[2px]"
      />
      <span className={clsx((!!appliedAt || disabledPrice) && 'text-white/50')}>
        %
      </span>
      <span className="mx-2 text-white/50">at</span>
      <InternalInput
        value={volume}
        onChange={onVolumeChange}
        readonly={!!appliedAt || disabledVolume}
        className="pr-1"
      />
      <span className="text-xs text-white/50">USDT</span>

      <div className="grow" />
      {appliedAt && (
        <span className="text-white/50">
          {dayjs(appliedAt).format('D MMM HH:mm')}
        </span>
      )}
    </div>
  );
};

export default PriceVolumeInput;
