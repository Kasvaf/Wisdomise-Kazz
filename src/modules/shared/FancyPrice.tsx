import * as numerable from 'numerable';

const FancyPrice: React.FC<{ value?: number; className?: string }> = ({
  value,
  className,
}) => {
  if (!value && value !== 0) return <div />;

  return (
    <span className={className}>
      <span className="text-white/40">$</span>
      <span>{numerable.format(value, '0,0.00')}</span>
    </span>
  );
};

export default FancyPrice;
