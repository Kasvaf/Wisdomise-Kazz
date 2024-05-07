import { clsx } from 'clsx';
import * as numerable from 'numerable';

const FancyPrice: React.FC<{
  value?: number | null;
  className?: string;
  greyClassName?: string;
}> = ({ value, className, greyClassName }) => {
  if (!value && value !== 0) return <div />;

  return (
    <span className={className}>
      <span className={clsx(greyClassName ?? 'text-white/40')}>$</span>
      <span>{numerable.format(value, '0,0.00')}</span>
    </span>
  );
};

export default FancyPrice;
