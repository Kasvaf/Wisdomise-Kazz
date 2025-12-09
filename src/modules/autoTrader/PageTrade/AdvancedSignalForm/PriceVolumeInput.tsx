import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toAmount } from 'shared/AmountInputBox';
import { Button } from 'shared/v1-components/Button';
import { roundSensible } from 'utils/numbers';

const InternalInput: React.FC<{
  value: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
  onClick?: () => void;
  readonly?: boolean;
  className?: string;
}> = ({ value, onChange, onBlur, onClick, readonly, className }) => {
  const [ref, setRef] = useState<HTMLInputElement | null>(null);
  const resize = () => {
    if (ref) {
      ref.style.setProperty('overflow-x', 'scroll', 'important');
      ref.style.width = '1px';
      ref.style.width = `${Math.max(
        ref.scrollWidth,
        127 +
          9 * value.replaceAll(/[.1]/g, '').length +
          5 * value.replaceAll(/[^.1]/g, '').length,
      )}px`;
      ref.style.removeProperty('overflow-x');
    }
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(resize, [ref, value]);

  return (
    <input
      className={clsx(
        '-mr-32 max-w-[calc(40%+168px)] bg-transparent pr-32 outline-none',
        readonly && 'text-white/50',
        className,
      )}
      onBlur={onBlur}
      onChange={resize}
      onClick={onClick}
      onInput={(e: any) => {
        const val = toAmount(e.target.value);
        onChange?.(val);
        e.target.value = val;
      }}
      readOnly={readonly}
      ref={setRef}
      value={value}
    />
  );
};

const PriceVolumeInput: React.FC<{
  label?: string;
  basePrice?: number;
  dirPrice: '+' | '-';
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
  basePrice,
  dirPrice,
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
  const disVol = !!appliedAt || disabledVolume;
  const disPrc = !!appliedAt || disabledPrice;

  return (
    <div className={clsx('w-full min-w-0', className)}>
      {label && <label className="mb-2 ml-2 block">{label}</label>}
      <div className="flex h-10 items-center overflow-x-hidden rounded-lg bg-black/30 pr-2">
        <Tooltip
          arrow={false}
          overlayClassName="[&_.ant-tooltip-inner]:bg-v1-surface-l2"
          placement="bottom"
          title={
            !disVol && (
              <div className="flex gap-1">
                {[25, 50, 75, 100].map(x => (
                  <Button
                    key={x}
                    onClick={() => onVolumeChange?.(String(x))}
                    size="2xs"
                    variant={x === +volume ? 'primary' : 'ghost'}
                  >
                    {x}%
                  </Button>
                ))}
              </div>
            )
          }
          trigger="click"
        >
          <InternalInput
            className="pl-2"
            onBlur={() => {
              onVolumeChange?.(
                +volume < 0 ? '0' : +volume > 100 ? '100' : volume,
              );
              onVolumeBlur?.();
            }}
            onChange={onVolumeChange}
            readonly={disVol}
            value={disVol ? roundSensible(volume) : volume}
          />
        </Tooltip>
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

        <Tooltip
          arrow={false}
          overlayClassName="[&_.ant-tooltip-inner]:bg-v1-surface-l2"
          placement="bottom"
          title={
            basePrice &&
            !disPrc && (
              <div className="flex gap-1">
                {[2, 5, 10, 15, 30].map(x => (
                  <Button
                    className="!px-1"
                    key={x}
                    onClick={() =>
                      onPriceChange?.(
                        roundSensible(
                          (basePrice * (100 + (dirPrice === '+' ? x : -x))) /
                            100,
                        ),
                      )
                    }
                    size="2xs"
                    variant={
                      price ===
                      roundSensible(
                        (basePrice * (100 + (dirPrice === '+' ? x : -x))) / 100,
                      )
                        ? 'primary'
                        : 'ghost'
                    }
                  >
                    {dirPrice}
                    {x}%
                  </Button>
                ))}
              </div>
            )
          }
          trigger="click"
        >
          <InternalInput
            className="pl-2"
            onBlur={onPriceBlur}
            onChange={onPriceChange}
            readonly={disPrc}
            value={disPrc ? roundSensible(price) : price}
          />
        </Tooltip>

        <span className="pointer-events-none ml-1 select-none text-white/50">
          $
        </span>

        <div className="grow" />
        {appliedAt && (
          <span className="ml-1 min-w-16 select-none text-2xs text-white/50">
            {dayjs(appliedAt).format('D MMM HH:mm')}
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceVolumeInput;
