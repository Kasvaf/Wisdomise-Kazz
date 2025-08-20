import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { roundSensible } from 'utils/numbers';
import { toAmount } from 'shared/AmountInputBox';
import { Button } from 'shared/v1-components/Button';

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
      ref={setRef}
      value={value}
      onChange={resize}
      className={clsx(
        '-mr-32 max-w-[calc(40%+168px)] bg-transparent pr-32 outline-none',
        readonly && 'text-white/50',
        className,
      )}
      onInput={(e: any) => {
        const val = toAmount(e.target.value);
        onChange?.(val);
        e.target.value = val;
      }}
      onBlur={onBlur}
      onClick={onClick}
      readOnly={readonly}
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
          trigger="click"
          placement="bottom"
          overlayClassName="[&_.ant-tooltip-inner]:bg-v1-surface-l2"
          arrow={false}
          title={
            !disVol && (
              <div className="flex gap-1">
                {[25, 50, 75, 100].map(x => (
                  <Button
                    key={x}
                    size="2xs"
                    variant={x === +volume ? 'primary' : 'ghost'}
                    onClick={() => onVolumeChange?.(String(x))}
                  >
                    {x}%
                  </Button>
                ))}
              </div>
            )
          }
        >
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
          trigger="click"
          placement="bottom"
          overlayClassName="[&_.ant-tooltip-inner]:bg-v1-surface-l2"
          arrow={false}
          title={
            basePrice &&
            !disPrc && (
              <div className="flex gap-1">
                {[2, 5, 10, 15, 30].map(x => (
                  <Button
                    key={x}
                    size="2xs"
                    variant={
                      price ===
                      roundSensible(
                        (basePrice * (100 + (dirPrice === '+' ? x : -x))) / 100,
                      )
                        ? 'primary'
                        : 'ghost'
                    }
                    className="!px-1"
                    onClick={() =>
                      onPriceChange?.(
                        roundSensible(
                          (basePrice * (100 + (dirPrice === '+' ? x : -x))) /
                            100,
                        ),
                      )
                    }
                  >
                    {dirPrice}
                    {x}%
                  </Button>
                ))}
              </div>
            )
          }
        >
          <InternalInput
            value={disPrc ? roundSensible(price) : price}
            onChange={onPriceChange}
            onBlur={onPriceBlur}
            readonly={disPrc}
            className="pl-2"
          />
        </Tooltip>

        <span className="pointer-events-none ml-1 select-none text-white/50">
          $
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
