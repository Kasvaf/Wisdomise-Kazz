import { clsx } from 'clsx';
import { ReadableNumber } from './ReadableNumber';
import PriceChange from './PriceChange';

export function InformativePrice({
  className,
  price,
  priceChange,
}: {
  className?: string;
  price?: number | null;
  priceChange?: number | null;
}) {
  return (
    <span
      className={clsx(
        'inline-flex flex-col items-start gap-px leading-normal',
        className,
      )}
    >
      <ReadableNumber value={price} label="usdt" />
      <PriceChange value={priceChange} className="text-[0.7em]" popup="never" />
    </span>
  );
}
