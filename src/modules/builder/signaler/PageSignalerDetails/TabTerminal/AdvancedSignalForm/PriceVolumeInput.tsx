import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
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
      ref.style.width = '1px';
      ref.style.width = `${ref.scrollWidth}px`;
    }
  };
  useEffect(resize, [ref, value]);

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
      onBlur={onBlur}
      readOnly={readonly}
    />
  );
};

const PriceVolumeInput: React.FC<{
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
  return (
    <div
      className={clsx(
        'flex h-10 items-center rounded-lg bg-black/30 px-2',
        className,
      )}
    >
      <InternalInput
        value={volume}
        onChange={onVolumeChange}
        onBlur={() => {
          onVolumeChange?.(+volume < 0 ? '0' : +volume > 100 ? '100' : volume);
          onVolumeBlur?.();
        }}
        readonly={!!appliedAt || disabledVolume}
        className="pr-[2px]"
      />
      <span className={clsx((!!appliedAt || disabledPrice) && 'text-white/50')}>
        %
      </span>
      <span className="mx-2 text-white/50">at</span>
      <InternalInput
        value={price}
        onChange={onPriceChange}
        onBlur={onPriceBlur}
        readonly={!!appliedAt || disabledPrice}
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
